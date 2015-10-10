var fs = require('fs');
var _ = require('lodash');
var File = require('./file');

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

Analysis.prototype.addFile = function (filePath) {
  var file = new File(filePath);
  this.files.push(file);
};

module.exports = Analysis;
