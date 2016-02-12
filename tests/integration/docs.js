'use strict';

const client = require('..').client,
      expect = require('chai').expect,
      test = require('red-tape');

test('docs', function*(t) {

    t.test('GET /api should return the docs root', function*(t) {
        const res = yield client.get('/api').end();
        expect(res.status).to.equal(200);
        expect(res.body).to.have.all.keys('1.0.0', '2.0.0');
        expect(res.body['1.0.0']).to.have.all.keys('docs', 'spec');
        expect(res.body['2.0.0']).to.have.all.keys('docs', 'spec');
    });

    t.test('GET /docs/1.0.0 should return a redirect', function*(t) {
        const res = yield client.get('/docs/1.0.0').end();
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/docs/1.0.0/?url=/api/1.0.0');
    });

    t.test('GET /api/1.0.0 should return a spec', function*(t) {
        const res = yield client.get('/api/1.0.0').end();
        expect(res.status).to.equal(200);
        expect(res.body.info.version).to.equal('1.0.0');
    });

    t.test('GET /docs/1.0.0 should return a redirect', function*(t) {
        const res = yield client.get('/docs/1.0.0').end();
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/docs/1.0.0/?url=/api/1.0.0');
    });

    t.test('GET /docs/1.0.0/ should return the swagger-ui', function*(t) {
        const res = yield client.get('/docs/1.0.0/?url=/api/1.0.0').end();
        expect(res.status).to.equal(200);
        expect(res.text).to.contain('<title>Swagger UI</title>');
    });

});
