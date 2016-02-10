'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      test = require('../');

test('GET /api/1.0.0/pet/1 should return a pet', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/api/1.0.0/pet/1')
        .expect(200)
        .end(function(err, res) {
            assert.equal(err, null, err);
            const expectedBody =  {
                id: 1,
                name: 'dog',
                photoUrls: [],
                version: '1.0.0'
            };
            assert.deepEqual(res.body, expectedBody);
        });
});

test('GET /api/2.0.0/pet/1 should return a pet', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/api/2.0.0/pet/1')
        .expect(200)
        .end(function(err, res) {
            assert.equal(err, null, err);
            const expectedBody =  {
                id: 1,
                name: 'dog',
                photoUrls: [],
                version: '2.0.0'
            };
            assert.deepEqual(res.body, expectedBody);
        });
});

test('GET /api/3.0.0/pet/1 should return error 404', function(assert) {
    // because there is no version 3.0.0
    assert.plan(1);
    agent(app)
        .get('/api/3.0.0/pet/1')
        .expect(404)
        .end(function(err, res) {
            assert.equal(err, null, err);
        });
});
