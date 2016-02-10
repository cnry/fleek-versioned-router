'use strict';

function* mock(next) {
    if (this.params.petId == '1') {
        this.body = this.fleek.validateModel('Pet', {
            id: 1,
            name: 'dog',
            photoUrls: [],
            version: this.fleek.swagger.info.version
        });
    } else if (this.params.petId == '2') {
        this.body = this.fleek.validateModel('Pet', {
            id: 'abc',
            name: 'cat',
            photoUrls: []
        });
    }
    yield next;
}

module.exports.delete = mock;
module.exports.get = mock;
module.exports.post = mock;
module.exports.put = mock;
