var fs = require('fs');
var mstat = require('../lib/mstat');
var expect = require('chai').expect;

describe("mstat", function(){
  afterEach(function() {
   fs.rmdirSync('./tmp');
  });

  it("throws an error when .meteor directory does not exist", function(){
    fs.mkdirSync('./tmp');
    expect(function() {
      mstat({appRoot: './tmp'});
    }).to.throw('No meteor project found');
  });
});
