'use strict';

const agent = require('supertest-koa-agent'),
      app = require('../../example/app'),
      expect = require('chai').expect,
      test = require('tape');

test('validator', function(assert) {
    assert.plan(2);
    agent(app)
        .get('/api/1.0.0/pet/abc')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({
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
            });
            assert.pass('GET /api/1.0.0/pet/abc should return error 400');
        });
    agent(app)
        .get('/api/1.0.0/pet/2')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal({
                error: 'Response Validation Failed',
                error_name: 'RESPONSE_VALIDATION_FAILED',
                details: [{
                    model: 'Pet',
                    errors: ['id (abc) is not a type of int64']
                }]
            });
            assert.pass('GET /api/1.0.0/pet/2 should return error 500');
        });
});
