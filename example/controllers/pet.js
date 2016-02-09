'use strict';

function* mock(next) {
    console.log(this.path, this.fleek.swagger.info.version);
    this.body = this.fleek.validateModel('Pet', {
        id: 'a',
        name: 'dog',
        photoUrls: []
    });
    yield next;
}

module.exports.delete = mock;
module.exports.get = mock;
module.exports.post = mock;
module.exports.put = mock;
