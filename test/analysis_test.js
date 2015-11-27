var Analysis = require('../lib/analysis');
var expect = require('chai').expect;

describe("Analysis", function(){
  describe("#totalLines", function(){
    it("Calculates the total lines of code", function(){
      var analysis = new Analysis([
        {numLines: 12},
        {numLines: 3},
        {numLines: 8}
      ]);

      expect(analysis.totalLines()).to.equal(23);
    });
  });

  describe("#fileCount", function(){
    it("Returns the number of files", function(){
      var analysis = new Analysis([
        {path: 'lib/a.js'},
        {path: 'lib/b.js'},
        {path: 'lib/c.js'}
      ]);

      expect(analysis.fileCount()).to.equal(3);
    });
  });

  describe("#serverFiles", function(){
    it("Returns the server files", function(){
      var serverFile1 = {architecture: 'server'};
      var serverFile2 = {architecture: 'server'};
      var clientFile = {architecture: 'client'};
      var bothFile = {architecture: 'both'};

      var analysis = new Analysis([
        serverFile1, serverFile2, clientFile, bothFile
      ]);

      var result = analysis.serverFiles();
      expect(result).to.include(serverFile1);
      expect(result).to.include(serverFile2);
      expect(result).to.not.include(clientFile);
      expect(result).to.not.include(bothFile);
    });
  });

  describe("#clientFiles", function(){
    it("Returns the client files", function(){
      var serverFile1 = {architecture: 'server'};
      var serverFile2 = {architecture: 'server'};
      var clientFile = {architecture: 'client'};
      var bothFile = {architecture: 'both'};

      var analysis = new Analysis([
        serverFile1, serverFile2, clientFile, bothFile
      ]);

      var result = analysis.clientFiles();
      expect(result).to.not.include(serverFile1);
      expect(result).to.not.include(serverFile2);
      expect(result).to.include(clientFile);
      expect(result).to.not.include(bothFile);
    });
  });

  describe("#bothFiles", function(){
    it("Returns the files whose architecture is 'both'", function(){
      var serverFile1 = {architecture: 'server'};
      var serverFile2 = {architecture: 'server'};
      var clientFile = {architecture: 'client'};
      var bothFile = {architecture: 'both'};

      var analysis = new Analysis([
        serverFile1, serverFile2, clientFile, bothFile
      ]);

      var result = analysis.bothFiles();
      expect(result).to.not.include(serverFile1);
      expect(result).to.not.include(serverFile2);
      expect(result).to.not.include(clientFile);
      expect(result).to.include(bothFile);
    });
  });

  describe("#fetchLargestFiles", function() {
    it("gets largest files with limit", function() {
      var analysis = new Analysis([
        {path: 'one.js', numLines: 12},
        {path: 'two.js', numLines: 3},
        {path: 'three.js', numLines: 8}
      ]);

      var result = analysis.fetchLargestFiles(2);
      expect(result.length).to.equal(2);
      expect(result[0].path).to.equal('one.js');
      expect(result[1].path).to.equal('three.js');
    });
  });

  describe("#fetchMostUsedExtensions", function() {
    it("gets the most used extensions with limit", function() {
      var analysis = new Analysis([
        {path: 'one.js', extension: '.js', numLines: 10},
        {path: 'two.js', extension: '.js', numLines: 12},
        {path: 'three.cpp', extension: '.cpp', numLines: 30},
        {path: 'four.jsx', extension: '.jsx', numLines: 5}
      ]);

      var result = analysis.fetchMostUsedExtensions(2);
      expect(result.length).to.equal(2);
      expect(result[0].name).to.equal('.js');
      expect(result[0].numFiles).to.equal(2);
      expect(result[1].name).to.equal('.cpp');
      expect(result[1].numFiles).to.equal(1);
    });
  });
});
