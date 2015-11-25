var fs = require('fs');
var path = require('path');

var gitignoreToGlob = require('gitignore-globs');
var micromatch = require('micromatch');
var readdir = require('recursive-readdir-sync');
var colors = require('colors');
var Analysis = require('./analysis');

function checkFileExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    return false;
  }

  return true;
}

function getIgnorePattern(appRoot, gitignorePath) {
  const defaultIgnore = [
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

function isCode(filePath) {
  const CODE_PATTERNS = [
    /.+\.js/,
    /.+\.jsx/,
    /.+\.html/,
    /.+\.handlebars/,
    /.+\.scss/,
    /.+\.css/,
    /.+\.less/,
    /.+\.json/
  ];

  return CODE_PATTERNS.some(function (pattern) {
    return pattern.test(filePath);
  });
}

module.exports = function (options) {
  if (! checkFileExists(path.join(options.appRoot, '.meteor'))) {
    throw new Error(
      `No meteor project found at ${path.resolve(options.appRoot)}`);
  }

  const ignorePattern = getIgnorePattern(options.appRoot, options.gitignorePath);

  var analysis = new Analysis();
  var files = readdir(options.appRoot);

  files.forEach(function (file) {
    var stat = fs.lstatSync(file);
    if (stat.isFile() && ! micromatch.any(file, ignorePattern) && isCode(file)) {
      analysis.addFile(file);
    }
  });

  return analysis;
};
