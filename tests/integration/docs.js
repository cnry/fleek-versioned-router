'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      expect = require('chai').expect,
      test = require('tape');

test('docs', function(assert) {
    assert.plan(4);
    agent(app)
        .get('/api')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('1.0.0', '2.0.0');
            expect(res.body['1.0.0']).to.have.all.keys('docs', 'spec');
            expect(res.body['2.0.0']).to.have.all.keys('docs', 'spec');
            assert.pass('GET /api should return the docs root');
        });
    agent(app)
        .get('/api/1.0.0')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.info.version).to.equal('1.0.0');
            assert.pass('GET /api/1.0.0 should return a spec');
        });
    agent(app)
        .get('/docs/1.0.0')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(302);
            expect(res.headers.location).to.equal('/docs/1.0.0/?url=/api/1.0.0');
            assert.pass('GET /docs/1.0.0 should return a redirect');
        });
    agent(app)
        .get('/docs/1.0.0/?url=/api/1.0.0')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('<title>Swagger UI</title>');
            assert.pass('GET /docs/1.0.0/ should return the swagger-ui');
        });
});
