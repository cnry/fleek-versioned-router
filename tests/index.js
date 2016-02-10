const test = require('tape');
module.exports = test;

// Add extra assertion methods.
require('tape-chai');

test.Test.prototype.keysEqual = function(objectWithKeys, expectedKeys) {
    this.deepEqual(Object.keys(objectWithKeys), expectedKeys);
}

// If this is the main module then automatically run all tests.
if (!module.parent) {
    const glob = require('glob'),
          path = require('path');
    glob.sync(path.join(__dirname, '*', '*.js')).map(require);
}
