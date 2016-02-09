'use strict';

const _ = require('lodash'),
      validator = require('fleek-validator');

const validate = validator.validate.one;

// Creates middleware that handles X-Api-Version headers.
function createMiddleware(config) {
    // Get the basePath for all spec versions.
    const basePaths = {};
    _.map(config.swaggerVersions, function(spec) {
        basePaths[spec.info.version] = spec.basePath;
    })

    // Build a swagger spec parameter that can be used to validate the version
    // header value. This approach results in consistent error messages.
    const versionHeaderParameter = {
        name: 'X-Api-Version',
        in: 'header',
        description: 'API version header',
        type: 'string',
        enum: _.keys(basePaths)
    };

    // Prepends the relevant basePath when a version header is found.
    return function*(next) {
        const version = this.headers['x-api-version'];
        if (version !== undefined) {
            const validationError = validate(version, versionHeaderParameter);
            if (validationError === undefined) {
                const basePath = basePaths[version];
                this.path = basePath + this.path;
            } else {
                this.status = 400;
                this.body = {
                    error: 'Validation Failed',
                    error_name: 'VALIDATION_FAILED',
                    details: [validationError]
                };
            }
        }
        yield next;
    };
}

module.exports = createMiddleware;
