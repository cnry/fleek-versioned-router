'use strict';

const _ = require('lodash'),
      helpers = require('./helpers');

// Build a spec config for fleek-router.
function buildRouterConfig(_config, spec) {
    const config = _.cloneDeep(_config);
    config.swagger = spec;

    // Use the docs config if enabled.
    if (config.docs) {
        config.docs = buildDocsConfig(config.docs, spec);
    }

    // Turn any existing middleware into an array.
    if (_.isArray(config.middleware) === false) {
        if (config.middleware === undefined) {
            config.middleware = [];
        } else {
            config.middleware = [config.middleware];
        }
    }

    // Let controllers know about the specs. This will run just before
    // any specified config.middleware and before controllers.
    config.middleware.unshift(function *(next) {
        // Add to this.fleek which gets created by fleek-router
        this.fleek.swagger = spec;
        yield next;
    });

    return config;
}

// Builds a spec config for koa-swagger-docs.
function buildDocsConfig(_config, spec) {
    const config = _config == true ? {} : _.cloneDeep(_config);

    config.spec = spec
    config.paths = config.paths || {};

    const docsPath = config.paths.docs === undefined ? '' : config.paths.docs,
          specPath = config.paths.spec === undefined ? '/swagger.json' : config.paths.spec;

    config.paths.docs = helpers.preparePath(docsPath, spec.info.version);
    config.paths.spec = helpers.preparePath(specPath, spec.info.version);

    console.log(config.paths)

    return config
}

module.exports = buildRouterConfig;
