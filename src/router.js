'use strict';

const _ = require('lodash'),
      compose = require('koa-compose'),
      defined = require('defined'),
      docs = require('./docs'),
      docsroot = require('./docsroot'),
      fleekRouter = require('fleek-router'),
      headers = require('./headers'),
      helpers = require('./helpers'),
      koa = require('koa'),
      models = require('./models'),
      path = require('path'),
      url = require('url');

// Gets a spec from a file path.
function getSpec(specPath) {
    const spec = require(specPath);
    const version = path.basename(specPath, '.json');
    if (spec.info.version != version) {
        throw new Error(
            'spec version should be ' + version + ' in ' + specPath);
    }
    return spec;
}

// Builds a spec config for fleek-router.
function buildConfig(_config, spec) {
    const config = _.cloneDeep(_config || {});
    config.swagger = spec;

    // Prepare the documentation config if enabled.
    if (config.documentation) {
        config.documentation.docs = helpers.versionedPath(
            defined(config.documentation.docs, '/docs/:version'), spec.info.version
        );
        config.documentation.spec = helpers.versionedPath(
            defined(config.documentation.spec, '/api/:version'), spec.info.version
        );
    }

    // Add model validation middleware if enabled.
    if (config.models) {
        config.response = models(spec);
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

// Creates middleware that performs validation, routing,
// and documentation for a swagger spec.
function createSpecMiddleware(config) {
    const app = koa();

    // Add documentation.
    if (config.documentation) {
        app.use(docs(config));
    }

    // Add validation and routing.
    fleekRouter(app, config);

    return compose(app.middleware);
}

// Creates middleware that handles all swagger specs.
function createMiddleware(config) {
    const middlewares = [];
    const docsRootUrls = {};

    if (config.documentation === true) {
        config.documentation =  {
            root: '/api'
        };
    }

    // Read in all of the swagger spec versions.
    config.swaggerVersions = _.map(config.swaggerVersions, function (spec) {
        return _.isString(spec) ? getSpec(spec) : spec;
    })

    // Create middleware to handle version HTTP headers. This must be
    // before the spec middleware because it alters the request path
    // to change which route gets used.
    middlewares.push(headers(config));

    // Create one middleware per spec version.
    _.map(config.swaggerVersions, function (spec) {
        // Create a versioned spec config and use it for middleware.
        const specConfig = buildConfig(config, spec);
        middlewares.push(createSpecMiddleware(specConfig));

        // Also keep track of URLs for the docs root page.
        if (config.documentation && config.documentation.root) {
            docsRootUrls[spec.info.version] = {
                docs: specConfig.documentation.docs,
                spec: specConfig.documentation.spec
            };
        }
    });

    // Create middleware to handle the docs root page.
    if (config.documentation && config.documentation.root) {
        middlewares.push(docsroot(config, docsRootUrls));
    }

    // Combine them all into one middleware.
    return compose(middlewares);
}

module.exports = createMiddleware;
