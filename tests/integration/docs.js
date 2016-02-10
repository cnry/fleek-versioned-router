'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      test = require('../');

test('GET /api/1.0.0 should return the spec', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/api/1.0.0')
        .expect(200)
        .end(function(err, res) {
            assert.equal(err, null, err);
            assert.equal(res.body.info.version, '1.0.0');
        });
});

test('GET /docs/1.0.0 should return swagger-ui', function(assert) {
    assert.plan(4);
    agent(app)
        .get('/docs/1.0.0')
        .expect(302)
        .end(function(err, res) {
            assert.equal(err, null, err);
            assert.equal(res.headers.location, '/docs/1.0.0/?url=/api/1.0.0');
        });
    agent(app)
        .get('/docs/1.0.0/?url=/api/1.0.0')
        .expect(200)
        .end(function(err, res) {
            assert.equal(err, null, err);
            assert.include(res.text, 'Swagger UI');
        });
});
