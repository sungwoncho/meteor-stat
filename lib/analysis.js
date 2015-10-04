var fs = require('fs');
var _ = require('lodash');

var Analysis = function (files) {
  this.files = files || [];
};

Analysis.prototype.totalLines = function () {
  var totalLines = 0;

  this.files.forEach(function (file) {
    totalLines += file.numLines;
  });

  return totalLines;
};

Analysis.prototype.extensions = function () {
  var extensions = {};

  this.files.forEach(function (file) {
    var ext = file.extension;

    if (extensions[ext]) {
      extensions[ext]++;
    } else {
      extensions[ext] = 1;
    }
  });

  return extensions;
};

Analysis.prototype.fileCount = function () {
  return this.files.length;
};

Analysis.prototype.serverFiles = function () {
  return _.where(this.files, {'architecture': 'server'});
};

Analysis.prototype.clientFiles = function () {
  return _.where(this.files, {'architecture': 'client'});
};

Analysis.prototype.bothFiles = function () {
  return _.where(this.files, {'architecture': 'both'});
};

Analysis.prototype.addFile = function (file) {
  function countLines(file) {
    const newLine = /\n/g;
    var content = fs.readFileSync(file, {encoding: 'utf-8'});
    var newLines = content.match(newLine) || [];

    return newLines.length;
  }

  function getExtension(file) {
    var re = /[A-Za-z]*(\.[a-z]+)$/g;
    var matched = re.exec(file);

    if (matched) {
      var ext = matched[1];
      return ext;
    } else {
      return 'none';
    }
  }

  // TODO: Use 'addFiles' definition from package.js to handle edge cases
  function getArchitecture(file) {
    if (/\/server\/.*/.test(file)) {
      return 'server';
    } else if (/\/client\/.*/.test(file)) {
      return 'client';
    } else {
      return 'both';
    }
  }

  var fileInfo = {
    numLines: countLines(file),
    extension: getExtension(file),
    architecture: getArchitecture(file),
    path: file
  };

  this.files.push(fileInfo);
};

module.exports = Analysis;
