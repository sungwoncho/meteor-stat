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
  var result = [];

  function initExtension(file) {
    var extensionInfo = {
      name: file.extension,
      numFiles: 1,
      numLines: file.numLines
    };

    result.push(extensionInfo);
  }

  this.files.forEach(function (file) {
    if (result.length === 0) {
      initExtension(file);
    } else {
      for (var i = 0; i < result.length; i++) {
        if (result[i] && result[i].name === file.extension) {
          result[i].numFiles++;
          result[i].numLines += file.numLines;
          break;
        } else if (i === result.length - 1) {
          initExtension(file);
          break;
        }
      }
    }
  });

  return result;
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

Analysis.prototype.fetchLargestFiles = function (limit) {
  var sortedFiles = _.sortBy(this.files, function (file) {
    return -file.numLines;
  });

  return _.slice(sortedFiles, 0, limit);
};

Analysis.prototype.fetchMostUsedExtensions = function (limit) {
  var sortedExtensions = _.sortBy(this.extensions(), function (extension) {
    return -extension.numFiles;
  });

  return _.slice(sortedExtensions, 0, limit);
};

module.exports = Analysis;
