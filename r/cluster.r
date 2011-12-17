require(RSQLite);
require(cluster);

debug <- FALSE;
# Open a sink for logging
sink("r/cluster.log");

# Data frames
load("data/baa.ratios.rda"); # into variable `ratios`

print(paste("Number of rows in `ratios`:", nrow(ratios)));

if (debug) print('a');

# Contants
GRAPHS_DIR <- "public/graphs";

if (debug) print('b');

# Pre-processing
  # We assume that the first argument is the type of graph,
  # and all subsequent arguments are genes
args <- commandArgs();

graph_type <- "undefined";
gene <- "undefined";

for (arg in args) {
  splt <- strsplit(arg, "--");
  status <- sapply(splt, function (x) if(length(x) < 2) "custom");
  if (status == 'custom') {
    if (arg == 'silhouette') {
      graph_type <- arg;
    } else {
      gene <- arg;
    }
  }
}

if (debug) print('c');

# Main DB connection
dbDriver <- dbDriver("SQLite");

if (debug) print('d');

# SQL database info
sql.info.final_clusters <- "final_clusters.sqlite";
sql.info.final_clusters.data_frames_table <- "ba_ratios";
sql.info.final_clusters.clusters_table <- "k173";

if (debug) print('e');

sql.clusters <- dbConnect(dbDriver, dbname = sql.info.final_clusters);
sql.clusters.ratios <- dbGetQuery(sql.clusters, "SELECT * FROM ba_ratios limit 100");
sql.clusters.k173 <- dbGetQuery(sql.clusters, "SELECT * FROM k173 limit 100");
# 
# 
# clustVec = c();
# for (i in sql.clusters.k173) {
#   clustVec = cbind(clustVec, i);
# }

# ratioVec = c();
# for (i in sql.clusters.ratios) {
#   ratioVec = append(ratioVec, i);
# }

# Find the specific dist for this gene

gene <- "GBAA4059";
sql.dist_db <- dbConnect(dbDriver, dbname = paste('clusters/dist/', gene, '.sqlite', sep = ""));
sql.gene_dist <- dbGetQuery(sql.dist_db, "SELECT d FROM dist");

if (debug) print('f');

# Plot graph depending on what graph type was requested

graph_path <- paste(GRAPHS_DIR, '/', sep = "");
graph_filename <- paste(unclass(Sys.time()), '.png', sep = "");

# Bivariate Cluster Plot

png(paste(graph_path, graph_filename, sep = ""));

if (graph_type == 'silhouette') {

  pr173 <- clara(sql.gene_dist, 173);
  str(si <- silhouette(pr173));
  (ssi <- summary(si));
  plot(si);

} else {

  print(paste("Length of `sql.clusters.k173` vector:", length(sql.clusters.ratios)));
  print(clustVec);
  print(sql.clusters.ratios);

  png(paste(graph_path, graph_filename, sep = ""));
#  clusplot(ratioVec, clustVec)
  clusplot(sql.clusters.ratios, clustVec);
  dev.off();

}  

dev.off();

sink();

print(paste("GRAPH_PRE", graph_filename, "GRAPH_POST", sep = ""));
