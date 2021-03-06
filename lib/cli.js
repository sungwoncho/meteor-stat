var program = require('commander');
var mstat = require('./mstat');
var output = require('./output');
var pkg = require('../package.json');

const defaultOpts = {
  appRoot: './',
  gitignore: './.gitignore'
};

program.version(pkg.version)
  .option('-i, --gitignore [path]', `Specify the path to .gitignore file. [${defaultOpts.gitignore}]`)
  .parse(process.argv);

var analysis = mstat({
  appRoot: program.args[0] || defaultOpts.appRoot,
  gitignorePath: program.gitignore || defaultOpts.gitignore
});

output(analysis);
