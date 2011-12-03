//
// Computing With Large Data Sets
// Visualization project
//
// December 2011
// @author Josh Leitzel <josh.leitzel@nyu.edu>
//

var http = require('http'),
    fs = require('fs'),
    connect = require('connect');

var templates = {
  index : 'index',
  run : 'run'
};

function getTemplate(templateName) {
  return fs.readFileSync('client/' + templateName + '.html').toString().replace('ROOT_PATH', ROOT_PATH);
}

connect(
  connect.static(__dirname + '/public')
).listen(1337);
