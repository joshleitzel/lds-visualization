//
// Computing With Large Data Sets
// Visualization project
//
// December 2011
// @author Josh Leitzel <josh.leitzel@nyu.edu>
//

var http = require('http'),
    _ = require('underscore')._,
    childProcess = require('child_process'),
    fs = require('fs'),
    express = require('express');

// Constants
var GRAPHS_DIR = 'graphs/',
    DATA_ROOT = 'data/',
    DATA_USER = 'uploads', // relative to DATA_ROOT
    SCRIPT_MAP = {
      cluster : 'r/cluster.r',
      regression : 'r/regression.r'
    };

// Clear tmp directory
childProcess.exec('rm public/tmp/*');

var server = express.createServer();

server.use(express.bodyParser())
  .use(express.static(__dirname + '/public'))

server.get('/graphs', function (req, res) {
  fs.readdir('public/graphs', function (err, files) {
    res.end(_.map(files, function (file) { return 'graphs/' + file; }).join(','));
  });
});

server.get('/zip', function (req, res) {
  var publicZipURL = 'tmp/graphs_' + new Date().getTime() + '.tar';
  childProcess.exec('tar czf public/' + publicZipURL + ' public/graphs/*', function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    res.end(publicZipURL);
  });
});

server.post('/process', function (req, res) {
  var clusters = req.body.clusters ? 'clusters=' + req.body.clusters : '',
      graph = 'graph=' + req.body.graph,
      process = req.body.process,
      visual = req.body.visual;

  console.log(visual);

  if (process != 'cluster' && process != 'regression') {
    res.end('Error: data sent is not valid');
  }

  var args = _.union([SCRIPT_MAP[process]], graph, clusters, visual);
  console.log('Rscript ' + args.join(' '));
  childProcess.exec('Rscript ' + args.join(' '), function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    res.end(stdout || stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});
server.listen(1337);
