'use strict';

const client = require('..').client,
      expect = require('chai').expect,
      test = require('red-tape');

test('validate', function*(t) {

    t.test('GET /api/1.0.0/pet/abc should return error 400', function*(t) {
        const res = yield client.get('/api/1.0.0/pet/abc').end();
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
    });

    t.test('GET /api/1.0.0/pet/2 should return error 500', function*(t) {
        const res = yield client.get('/api/1.0.0/pet/2').end();
        expect(res.status).to.equal(500);
        expect(res.body).to.deep.equal({
            error: 'Response Validation Failed',
            error_name: 'RESPONSE_VALIDATION_FAILED',
            details: [{
                model: 'Pet',
                errors: ['id (abc) is not a type of int64']
            }]
        });
    });

});
