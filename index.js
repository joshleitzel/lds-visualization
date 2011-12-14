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

function getTemplate(templateName) {
  return fs.readFileSync('client/' + templateName + '.html').toString().replace('ROOT_PATH', ROOT_PATH);
}

var server = express.createServer();

server.use(express.bodyParser())
  .use(express.static(__dirname + '/public'))

server.get('/data', function (req, res) {
  var dataSets = [];
  fs.readdir(DATA_ROOT, function (err, files) {
    dataSets = _.without(files, DATA_USER);
    fs.readdir(DATA_ROOT + DATA_USER, function (err, files) {
      files = _.map(files, function (file) { return DATA_USER + '/' + file; });
      dataSets = _.union(dataSets, files);
      res.end(dataSets.join(','));
    });
  });
});

server.post('/upload', function (req, res) {
  var uploadFile = req.files.dataUpload;
  if (!uploadFile) {
    res.end('Error: no file passed');
  }

  // move file to data dir
  var copyProc = childProcess.spawn('cp', [uploadFile.path, DATA_ROOT + DATA_USER + '/' + uploadFile.name]);
  copyProc.on('exit', function (exitCode) {
    res.redirect('/');
  });
});

server.post('/process', function (req, res) {
  var dataSets = req.body.dataSets,
      process = req.body.process;

  if (!_.isArray(dataSets) || (process != 'cluster' && process != 'regression')) {
    res.end('Error: data sent is not valid');
  }

  // if 'all' was chosen
  if (dataSets === ['all']) {
    dataSets = ['*'];
  } else if (dataSets === ['random']) {
    var i,
        random = [];
    for (i = 0; i < 5; i++) {
      random.push(Math.floor(Math.random() * (103 + 1) + 0));
    }

    fs.readdir(DATA_ROOT, function (err, files) {
      dataSets = _.without(files, DATA_USER);
      fs.readdir(DATA_ROOT + DATA_USER, function (err, files) {
        files = _.map(files, function (file) { return DATA_USER + '/' + file; });
        dataSets = _.union(dataSets, files);
        res.end(dataSets.join(','));
      });
    });
  }

  // any pre-R processing of the data goes here

  var args = _.union([SCRIPT_MAP[process]], ['silhouette'], dataSets);
  console.log('Rscript ' + args.join(' '));
  var rProc = childProcess.exec('Rscript ' + args.join(' '), function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    res.end(stdout || stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});
server.listen(1337);
