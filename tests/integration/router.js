'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      expect = require('chai').expect,
      test = require('tape');

test('router', function(assert) {
    assert.plan(3);
    agent(app)
        .get('/api/1.0.0/pet/1')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                id: 1,
                name: 'dog',
                photoUrls: [],
                version: '1.0.0'
            });
            assert.pass('GET /api/1.0.0/pet/1 should return a pet');
        });
    agent(app)
        .get('/api/2.0.0/pet/1')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                id: 1,
                name: 'dog',
                photoUrls: [],
                version: '2.0.0'
            });
            assert.pass('GET /api/2.0.0/pet/1 should return a pet');
        });
    agent(app)
        .get('/api/3.0.0/pet/1')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(404);
            assert.pass('GET /api/3.0.0/pet/1 should return error 404');
        });
});
