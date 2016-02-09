'use strict';

const _ = require('lodash');

// Creates middleware that handles X-Api-Version headers.
function createMiddleware(config) {
    // Get the basePath for each spec version.
    const basePaths = {};
    _.map(config.swaggerVersions, function(spec) {
        basePaths[spec.info.version] = spec.basePath;
    })

    // Injects the relevant basePath when a version header is found.
    return function*(next) {
        const version = this.headers['x-api-version'];
        if (version !== undefined) {
            const basePath = basePaths[version];
            if (basePath !== undefined) {
                this.path = basePath + this.path;
            }
        }
        yield next;
    };
}

module.exports = createMiddleware;
