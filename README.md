# Large Data Sets - Visualization Project #

## Start: web page with text input ##

* User inputs what they want, e.g., “cluster GBAA001 GBAA002”
* User input is sent to server (via JavaScript) which passes it along to one of two R programs depending on the action requested (“cluster” or “regression”)
* R program crunches:
  * background info: mean, median, blah blah stats 101 - 
  * if there are two or more data sets passed, R program must do some meaningful comparison between them
  * reorders data and passes back to javascript
  * take a look at bioconductor packages: http://www.bioconductor.org/
  * format the data however you want and put it into a sqlite database; the javascript will parse the database according to how you’ve formatted it and deal with the data
  * cases:
      * one data set (easy): pass back almost the same thing you got in (plus background info)
      * two or more data sets: pass back the combined data
      * possible case in which data do not all have same features
* Output of R program passed to JavaScript visualizer
  * js will use a javascript graph library like protovis (http://mbostock.github.com/protovis/) or d3 (http://mbostock.github.com/d3/)
