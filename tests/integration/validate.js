'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      test = require('../');

test('GET /api/1.0.0/pet/abc should return error 400', function(assert) {
    // because abc is an invalid id
    assert.plan(2);
    agent(app)
        .get('/api/1.0.0/pet/abc')
        .expect(400)
        .end(function(err, res) {
            assert.equal(err, null, err);
            const expectedBody = {
                error: 'Validation Failed',
                error_name: 'VALIDATION_FAILED',
                details: [{
                    name: 'TYPE.INTEGER',
                    code: 102,
                    message: 'Integer expected',
                    parameter: {
                        name: 'petId',
                        in: 'path',
                        description: 'ID of pet to return',
                        required: true,
                        type: 'integer',
                        format: 'int64'
                    }
                }]
            };
            assert.deepEqual(res.body, expectedBody);
        });
});

test('GET /api/1.0.0/pet/2 should return error 500', function(assert) {
    // because the example controller purposefully uses invalid data for id=2
    assert.plan(2);
    agent(app)
        .get('/api/1.0.0/pet/2')
        .expect(500)
        .end(function(err, res) {
            assert.equal(err, null);
            const expectedBody = {
                error: 'Response Validation Failed',
                error_name: 'RESPONSE_VALIDATION_FAILED',
                details: [{
                    model: 'Pet',
                    errors: ['id (abc) is not a type of int64']
                }]
            };
            assert.deepEqual(res.body, expectedBody);
        });
});
