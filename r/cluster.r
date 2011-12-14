require(RSQLite);
##require(cluster);

debug <- FALSE;

if (debug) print('a');

# Contants
GRAPHS_DIR <- "graphs";

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
sql.clusters.table <- dbReadTable(sql.clusters, "ba_ratios");

if (debug) print('f');

# Plot graph depending on what graph type was requested
  # Silhouette
if (graph_type == 'silhouette') {
  cG <- new("clusterGraph", clusters=list(a=c(1:10), b=c(11:13), c=c(14:20), d=c(21, 22)));
}

##demopam <- pam(dis.bc, k=173)




print(graph_type);
print(gene);
