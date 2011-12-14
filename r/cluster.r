require(RSQLite);
require(cluster);

debug <- FALSE;

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
sql.clusters.ratios <- dbReadTable(sql.clusters, "ba_ratios");
sql.clusters.k173 <- dbGetQuery(sql.clusters, "SELECT out FROM k173");

# Find the specific dist for this gene

gene <- "GBAA4059";
sql.dist_db <- dbConnect(dbDriver, dbname = paste('clusters/dist/', gene, '.sqlite', sep = ""));
sql.gene_dist <- dbGetQuery(sql.dist_db, "SELECT d FROM dist");

if (debug) print('f');

# Plot graph depending on what graph type was requested

graph_path <- paste(GRAPHS_DIR, '/', sep = "");
graph_filename <- paste(unclass(Sys.time()), '.png', sep = "");

# Silhouette
if (graph_type == 'silhouette') {
  #cG <- new("clusterGraph", clusters=list(a=c(1:10), b=c(11:13), c=c(14:20), d=c(21, 22)));

  ## Use the silhouette widths for assessing the best number of clusters,
  ## following a one-dimensional example from Christian Hennig :
  ##
  # x <- c(rnorm(50), rnorm(50,mean=5), rnorm(30,mean=15))
  # asw <- numeric(20)
  # ## Note that "k=1" won't work!
  # for (k in 2:20)
  #   asw[k] <- pam(x, k) $ silinfo $ avg.width
  # k.best <- which.max(asw)
  # cat("silhouette-optimal number of clusters:", k.best, "\n")
  # 
  # png(paste(graph_path, graph_filename, sep = ""));
  # plot(1:20, asw, type= "h", main = "pam() clustering assessment",
  #      xlab= "k  (# clusters)", ylab = "average silhouette width")
  # axis(1, k.best, paste("best",k.best,sep="\n"), col = "red", col.axis = "red")
  # dev.off();

# pr4 <- pam(sql.gene_dist, 173)
print(class(sql.gene_dist));
print(nrow(sql.gene_dist));
print(ncol(sql.gene_dist));
  
  png(paste(graph_path, graph_filename, sep = ""));
  clusplot(as.matrix(sql.gene_dist), sql.clusters.k173, diss = TRUE);
  dev.off();
  
  # str(si <- silhouette(as.matrix(sql.clusters.k173), sql.gene_dist))
  #   (ssi <- summary(si))
  #   png(paste(graph_path, graph_filename, sep = ""));
  #   plot(si) # silhouette plot
  #   plot(si, col = c("red", "green", "blue", "purple"))# with cluster-wise coloring
  #   dev.off();
  
}

##demopam <- pam(dis.bc, k=173)



print(paste("GRAPH_PRE", graph_filename, "GRAPH_POST", sep = ""));
