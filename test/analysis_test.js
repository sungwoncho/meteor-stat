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
});
