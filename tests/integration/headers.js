'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      test = require('../');

test('GET /pet/1 with valid X-Api-Version should return a pet', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/pet/1')
        .set('X-Api-Version', '1.0.0')
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

test('GET /pet/1 with invalid X-Api-Version should return error 400', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/pet/1')
        .set('X-Api-Version', '3.0.0')
        .expect(400)
        .end(function(err, res) {
            assert.equal(err, null, err);
            const expectedBody = {
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
            };
            assert.deepEqual(res.body, expectedBody);
        });
});
