var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

var notifier = updateNotifier({
  pkg: pkg
});

notifier.notify();
