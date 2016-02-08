'use strict';

function* mock() {
    this.body = 'version ' + this.fleek.swagger.info.version;
}

module.exports.delete = mock;
module.exports.get = mock;
module.exports.post = mock;
