var fs = require('fs');

var File = function (path) {
  this.path = path;
  this.numLines = this.countLines();
  this.extension = this.getExtension();
  this.architecture = this.getArchitecture();
  this.patterns = this.getPatterns();
};

File.prototype.countLines = function() {
  const newLine = /\n/g;
  var content = fs.readFileSync(this.path, {encoding: 'utf-8'});
  var newLines = content.match(newLine) || [];

  return newLines.length;
};

File.prototype.getExtension = function() {
  var re = /[A-Za-z]*(\.[a-z]+)$/g;
  var matched = re.exec(this.path);

  if (matched) {
    var ext = matched[1];
    return ext;
  } else {
    return 'none';
  }
};

// TODO: Use 'addFiles' definition from package.js to handle edge cases
File.prototype.getArchitecture = function() {
  console.log(this.path);

  if (/(\/|^)server\/.*/.test(this.path)) {
    return 'server';
  } else if (/(\/|^)client\/.*/.test(this.path)) {
    return 'client';
  } else {
    return 'both';
  }
};

File.prototype.getPatterns = function () {
  if (this.extension === '.js') {
    // Check for method definition
    const METHOD_DEFINITION = /Meteor.methods\(\{/g;
    var content = fs.readFileSync(this.path, {encoding: 'utf-8'});

  }
};

module.exports = File;
