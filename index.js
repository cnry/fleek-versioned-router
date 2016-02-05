'use strict';

const _ = require('lodash'),
      buildConfig = require('./config'),
      compose = require('koa-compose'),
      fleekRouter = require('fleek-router'),
      helpers = require('./helpers'),
      koa = require('koa'),
      path = require('path'),
      swaggerDocs = require('koa-swagger-docs'),
      url = require('url');


// Gets a spec from a file path, also performing minor validation.
function getSpec(specPath) {
    const spec = require(specPath);
    const version = path.basename(specPath, '.json');
    if (spec.info.version != version) {
        throw new Error(
            'spec version should be ' + version + ' in ' + specPath);
    }
    return spec;
}

// Creates middleware that performs validation, routing,
// and documentation for a swagger spec.
function createSpecMiddleware(config) {
    const app = koa();

    // Add documentation.
    if (config.docs) {
        app.use(swaggerDocs(_.cloneDeep(config.docs)));
    }

    // Add validation and routing.
    fleekRouter(app, config);

    return compose(app.middleware);
}

// Creates middleware that serves a documentation index page.
function createDocsRootMiddleware(config, urls) {
    return function* (next) {
        if (helpers.removeTrailingSlash(this.path) == config.docs.root) {
            const body = {};
            let base = helpers.removeTrailingSlash(
                url.resolve(this.request.href, '/')
            );
            _.forEach(config.swaggerVersions, function (spec) {
                const version = spec.info.version,
                      result = {};
                _.map(urls[version], function(_path, key) {
                    result[key] = base + _path;
                });
                body[version] = result;
            });
            this.body = body;
        }
        yield next;
    }
}

// Creates middleware that handles all swagger specs.
function createMiddleware(config) {
    const middlewares = [],
          docsRootUrls = {};

    if (config.docs === true) {
        config.docs =  {
            root: '/api',
            paths: {
                docs: '/docs/:version',
                spec: '/api/:version'
            }
        };
    }

    // Read in all of the swagger spec versions.
    config.swaggerVersions = _.map(config.swaggerVersions, function (spec) {
        return _.isString(spec) ? getSpec(spec) : spec;
    })

    // Create one middleware per spec version.
    _.map(config.swaggerVersions, function (spec) {
        // Create a versioned spec config and use it for middleware.
        const specConfig = buildConfig(config, spec);
        middlewares.push(createSpecMiddleware(specConfig));

        // Also keep track of URLs for the docs root page.
        if (config.docs) {
            docsRootUrls[spec.info.version] = {
                docs: specConfig.docs.paths.docs,
                spec: specConfig.docs.paths.spec
            };
        }
    });

    // Create middleware to handle the main docs URL.
    if (config.docs) {
        middlewares.push(createDocsRootMiddleware(config, docsRootUrls));
    }

    // Combine them all into one middleware.
    return compose(middlewares);
}

module.exports = createMiddleware;
