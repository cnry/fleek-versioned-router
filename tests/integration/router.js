'use strict';

const client = require('..').client,
      expect = require('chai').expect,
      test = require('red-tape');

test('router', function*(t) {

    t.test('GET /api/1.0.0/pet/1 should return a pet', function*(t) {
        const res = yield client.get('/api/1.0.0/pet/1').end();
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
            id: 1,
            name: 'dog',
            photoUrls: [],
            version: '1.0.0'
        });
    });

    t.test('GET /api/2.0.0/pet/1 should return a pet', function*(t) {
        const res = yield client.get('/api/2.0.0/pet/1').end();
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
            id: 1,
            name: 'dog',
            photoUrls: [],
            version: '2.0.0'
        });
    });

    t.test('GET /api/3.0.0/pet/1 should return error 404', function*(t) {
        const res = yield client.get('/api/3.0.0/pet/1').end();
        expect(res.status).to.equal(404);
    });

});
