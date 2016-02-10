// If this is the main module then automatically run all tests.
if (!module.parent) {
    const glob = require('glob'),
          path = require('path');
    glob.sync(path.join(__dirname, '*', '*.js')).map(require);
}
