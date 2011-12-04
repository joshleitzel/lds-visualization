# Large Data Sets - Visualization Project #

## Local Setup ##
* Install Node.js
  * `brew install node` for those enlightened souls with OS X and [Homebrew](http://mxcl.github.com/homebrew/), [nodejs.org](http://nodejs.org) for everybody else
* Install NPM (Node Package Manager)
  * `curl http://npmjs.org/install.sh | sh`
* Inside your repo's directory, run `npm install`
* To run the server, run `nodemon index.js`
* Point your browser to `http://localhost:1337`, et voila!

## Todo ##
* (*in progress*) Basic web interface for running the application
* (*mostly done*) Users can upload data sets or choose from pre-existing ones
* R programs for parsing the data
  * Clustering program (file: `r/cluster.r`)
  * Regression program (file: `r/regression.r`)
  * Program to re-arrange the data (e.g., "sort by mean", "sort by median") (file: `r/format.r`)
* (*in progress*) Server to handle the data interchange between R and JavaScript
* Client-side visualization of the parsed data
* Deploy to live server
