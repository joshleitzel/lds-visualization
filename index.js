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

// Create a tmp directory or replace the old one
console.log('Clearing public/tmp/ directory...');
childProcess.exec('rm public/tmp/*.tar');

var server = express.createServer();

server.use(express.bodyParser())
  .use(express.static(__dirname + '/public'))

server.get('/cleargraphs', function (req, res) {
  console.log('Clearing graphs...');
  childProcess.exec('rm public/graphs/*.png', function () {
    res.end('done');
  })
});

server.get('/graphs', function (req, res) {
  console.log('Getting graphs...');
  fs.readdir('public/graphs', function (err, files) {
    res.end(_.map(_.without(files, 'README'), function (file) { return 'graphs/' + file; }).join(','));
  });
});

server.get('/tar', function (req, res) {
  console.log('Building tarball...');
  var publicTarURL = 'tmp/graphs_' + new Date().getTime() + '.tar';
  childProcess.exec('tar czf public/' + publicTarURL + ' public/graphs', function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    res.end(publicTarURL);
  });
});

server.post('/process', function (req, res) {
  console.log('Processing graph...');
  var clusters = req.body.clusters ? 'clusters=' + req.body.clusters : '',
      graph = 'graph=' + req.body.graph,
      process = req.body.process,
      visual = req.body.visual;

  if (process != 'cluster' && process != 'regression') {
    res.end('Error: data sent is not valid');
  }

  var args = _.union([SCRIPT_MAP[process]], graph, clusters, visual);
  console.log('Invoking Rscript ' + args.join(' '));
  childProcess.exec('Rscript ' + args.join(' '), function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
    res.end(stdout || stderr);
  });
});
server.listen(1337);
