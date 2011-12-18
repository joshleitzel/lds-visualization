# Helper functions to be used in other files

helpers.parseRGB <- function(parseString) {
  stringSplit <- unlist(strsplit(parseString, ","));
  rgb(stringSplit[1], stringSplit[2], stringSplit[3], maxColorValue = 255);
}
