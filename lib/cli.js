var program = require('commander');
var mloc = require('./mloc');
var output = require('./output');

program.version('0.1.0')
  .parse(process.argv);

var appRoot = program.args[0] || './';
var result = mloc(appRoot);

output(result);
