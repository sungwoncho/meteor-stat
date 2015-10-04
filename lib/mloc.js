var fs = require('fs');
var path = require('path');

var gitignoreToGlob = require('gitignore-globs');
var micromatch = require('micromatch');
var readdir = require('recursive-readdir-sync');

function checkFileExists(path) {
  try {
    fs.lstatSync(gitignore);
  } catch (e) {
    return false;
  }

  return true;
}

function getIgnorePattern(appRoot) {
  var defaultIgnore = [
    '.git/**',
    '.*',
    '**/.*',
    'node_modules/**/.*', // https://github.com/sevenweb/gitignore-globs/issues/3
    '.meteor/**',
    'packages/npm-container/**', // For meteorhacks/npm
    'packages/npm-container/**/.*',
    'packages/npm-container/.**',
    '**/.DS_Store'
  ];
  var gitignore = path.join(appRoot, '.gitignore');

  if (checkFileExists(gitignore)) {
    var globs = gitignoreToGlob(gitignore);
    return defaultIgnore.concat(globs);
  } else {
    return defaultIgnore;
  }
}

module.exports = function (appRoot) {
  const ignorePattern = getIgnorePattern(appRoot);

  var totalLines = 0;

  function countLines(file) {
    const newLine = /\n/g;

    var content = fs.readFileSync(file, {encoding: 'utf-8'});
    var newLines = content.match(newLine) || [];

    totalLines += newLines.length;
  }

  var files = readdir(appRoot);
  files.forEach(function (file) {
    if (! micromatch.any(file, ignorePattern)) {
      countLines(file);
    }
  });

  return {
    totalLines: totalLines
  };
};
