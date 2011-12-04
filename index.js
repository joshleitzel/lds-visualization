//
// Computing With Large Data Sets
// Visualization project
//
// December 2011
// @author Josh Leitzel <josh.leitzel@nyu.edu>
//

var http = require('http'),
    _ = require('underscore')._,
    fs = require('fs'),
    express = require('express');

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
  .post('/process', function (req, res) {
    var dataSets = req.body.dataSets,
        process = req.body.process;

    if (_.isArray(dataSets) || (process != 'cluster' && process != 'regression')) {
      res.end('Error: data sent is not valid');
    }

    var rProc = require('child_process').spawn('Rcsript', [scriptMap[process], dataSets.join(' ')]);
    rProc.stdout.on('data', function (data) {
      console.log(data);
      // send back to client
      res.end({ returned : 'return' });
    });
    rProc.stderr.on('data', function (error) {
      console.log('Error:');
      console.log(error);
    });
    rProc.on('exit', function (exitCode) {
      console.log('exit', exitCode);
    });
  });
server.listen(1337);
