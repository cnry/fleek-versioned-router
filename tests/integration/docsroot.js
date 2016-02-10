'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      test = require('../');

test('GET /api should return the docs root', function(assert) {
    assert.plan(4);
    agent(app)
        .get('/api')
        .expect(200)
        .end(function(err, res) {
            assert.equal(err, null, err);
            assert.keysEqual(res.body, ['1.0.0', '2.0.0']);
            assert.keysEqual(res.body['1.0.0'], ['docs', 'spec']);
            assert.keysEqual(res.body['2.0.0'], ['docs', 'spec']);
        });
});
