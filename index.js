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
var DATA_ROOT = 'data/',
    DATA_USER = 'uploads'; // relative to DATA_ROOT

var templates = {
  index : 'index',
  run : 'run'
};

var scriptMap = {
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
      console.log(dataSets);
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

    // any pre-R processing of the data goes here

    var rProc = childProcess.spawn('Rcsript', [scriptMap[process], dataSets.join(' ')]);
    rProc.stdout.on('data', function (data) {
      var responseData = {};
      // process sqlite response data from R and send it back as JSON
      res.end({ responseData : responseData });
    });
    rProc.stderr.on('data', function (error) {
      res.end('There was a processing error');
    });
    rProc.on('exit', function (exitCode) {
      console.log('exit', exitCode);
    });
  });
server.listen(1337);
