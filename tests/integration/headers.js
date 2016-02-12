'use strict';

const client = require('..').client,
      expect = require('chai').expect,
      test = require('red-tape');

test('headers', function*(t) {

    t.test('GET /pet/1 with valid X-Api-Version should return a pet', function*(t) {
        const res = yield client.get('/pet/1').set('X-Api-Version', '1.0.0').end();
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
            id: 1,
            name: 'dog',
            photoUrls: [],
            version: '1.0.0'
        });
    });

    t.test('GET /pet/1 with invalid X-Api-Version should return error 400', function*(t) {
        const res = yield client.get('/pet/1').set('X-Api-Version', '3.0.0').end();
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
    });

});
