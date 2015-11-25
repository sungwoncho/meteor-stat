var Table = require('cli-table');
var colors = require('colors');
var _ = require('lodash');

function printArchitectureOverview(analysis) {
  var table = new Table(
    {
      head: ['', '# Files', '# Lines'],
      chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
      style: {head: ['blue'], 'padding-left': 3, 'padding-right': 3, border: ['blue']},
    }
  );

  var serverFiles = analysis.serverFiles();
  var clientFiles = analysis.clientFiles();
  var bothFiles = analysis.bothFiles();

  var serverLineCount = getLineCount(serverFiles);
  var clientLineCount = getLineCount(clientFiles);
  var bothLineCount = getLineCount(bothFiles);
  var totalLineCount = serverLineCount + clientLineCount + bothLineCount;

  function getLineCount(files) {
    var lineCount = 0;
    files.forEach(function (file) {
      lineCount += file.numLines;
    });

    return lineCount;
  }

  function calcPercentage(val, total) {
    var result = (val / total * 100);
    return result.toFixed(1);
  }

  table.push(
    {'------------': ['------------'.blue, '------------'.blue]},
    {'Server': [
      `${serverFiles.length} (${calcPercentage(serverFiles.length, analysis.fileCount())}%)`,
      `${serverLineCount} (${calcPercentage(serverLineCount, totalLineCount)}%)`
    ]},
    {'Client': [
      `${clientFiles.length} (${calcPercentage(clientFiles.length, analysis.fileCount())}%)`,
      `${clientLineCount} (${calcPercentage(clientLineCount, totalLineCount)}%)`]
    },
    {'Both': [
      `${bothFiles.length} (${calcPercentage(bothFiles.length, analysis.fileCount())}%)`,
      `${bothLineCount} (${calcPercentage(bothLineCount, totalLineCount)}%)`
    ]},
    {'------------': ['------------'.blue, '------------'.blue]},
    {'Total': [analysis.fileCount(), totalLineCount]}
  );

  console.log(table.toString());
}

function printLargestFilesOverview(analysis) {
  var largestFiles = analysis.fetchLargestFiles(3);
  largestFiles.forEach(function (file) {
    console.log(`${file.path} ${'----'.blue} ${file.numLines} lines`);
  });
}

module.exports = function (analysis) {
  console.log('---------------------------------------------------------'.blue);
  console.log('                     Meteor Stat'.blue);
  console.log('---------------------------------------------------------'.blue);
  console.log('');
  console.log('# Architecture overview'.blue);
  printArchitectureOverview(analysis);
  console.log('');
  console.log('# Largest files'.blue);
  console.log('');
  printLargestFilesOverview(analysis);
};
