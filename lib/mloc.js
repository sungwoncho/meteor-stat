var fs = require('fs');
var path = require('path');

var gitignoreToGlob = require('gitignore-globs');
var micromatch = require('micromatch');
var readdir = require('recursive-readdir-sync');
var colors = require('colors');

function checkFileExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    return false;
  }

  return true;
}

function getIgnorePattern(appRoot, gitignorePath) {
  var defaultIgnore = [
    '.git/**',
    '.*',
    '**/.*',
    'node_modules/**/.*', // https://github.com/sevenweb/gitignore-globs/issues/3
    '**/node_modules/**',
    '.meteor/**',
    '**/.meteor/**',
    'packages/npm-container/**', // For meteorhacks/npm
    'packages/npm-container/**/.*',
    'packages/npm-container/.**',
    '**/.DS_Store'
  ];
  var gitignore = path.resolve(appRoot, gitignorePath);

  if (checkFileExists(gitignore)) {
    var globs = gitignoreToGlob(gitignore);
    return defaultIgnore.concat(globs);
  } else {
    console.log('Warning: Cannot find .gitignore file:'.yellow.underline);
    console.log(gitignore);
    console.log('');
    return defaultIgnore;
  }
}

module.exports = function (options) {
  const ignorePattern = getIgnorePattern(options.appRoot, options.gitignorePath);

  var totalLines = 0;

  function countLines(file) {
    const newLine = /\n/g;
    var content = fs.readFileSync(file, {encoding: 'utf-8'});
    var newLines = content.match(newLine) || [];

    totalLines += newLines.length;
  }

  var files = readdir(options.appRoot);
  files.forEach(function (file) {
    var stat = fs.lstatSync(file);
    if (stat.isFile() && ! micromatch.any(file, ignorePattern)) {
      countLines(file);
    }
  });

  return {
    totalLines: totalLines
  };
};