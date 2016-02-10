'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      expect = require('chai').expect,
      test = require('tape');

test('headers', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/pet/1')
        .set('X-Api-Version', '1.0.0')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
                id: 1,
                name: 'dog',
                photoUrls: [],
                version: '1.0.0'
            });
            assert.pass('GET /pet/1 with valid X-Api-Version should return a pet');
        });
    agent(app)
        .get('/pet/1')
        .set('X-Api-Version', '3.0.0')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({
                error: 'Validation Failed',
                error_name: 'VALIDATION_FAILED',
                details: [{
                    name: 'VALUE.ENUM',
                    code: 203,
                    message: 'Only the Following values are allowed: 1.0.0,2.0.0',
                    parameter: {
                        name: 'X-Api-Version',
                        in: 'header',
                        description: 'API version header',
                        type: 'string',
                        enum: ['1.0.0', '2.0.0']
                    }
                }]
            });
            assert.pass('GET /pet/1 with invalid X-Api-Version should return error 400');
        });
});
