'use strict';

const _ = require('lodash'),
      compose = require('koa-compose'),
      helpers = require('./helpers'),
      mount = require('koa-mount'),
      path = require('path'),
      serve = require('koa-static');

// Prepares a versioned path.
function preparePath(_path, version) {
    return helpers.removeTrailingSlash(helpers.replaceVersion(_path, version));
}

// Builds a config for the middleware.
function buildConfig(_config, spec) {
    const config = _config == true ? {} : _.cloneDeep(_config);

    config.spec = spec
    config.paths = config.paths || {};

    const docsPath = config.paths.docs === undefined ? '' : config.paths.docs;
    const specPath = config.paths.spec === undefined ? '/swagger.json' : config.paths.spec;

    config.paths.docs = preparePath(docsPath, spec.info.version);
    config.paths.spec = preparePath(specPath, spec.info.version);

    return config
}

// Creates middleware to serve documentation.
function createMiddleware(_config) {
    const config = _.cloneDeep(_config);
    const middlewares = [];

    // Set default paths.
    config.paths = config.paths || {};
    config.paths.spec = config.paths.spec || '/swagger.json';
    config.paths.docs = config.paths.docs || '/docs';

    // Add middleware to serve the spec document.
    middlewares.push(function* (next) {
        if (this.path == config.paths.spec) {
            this.body = config.spec;
        };
        yield next;
    });

    // Add middleware for handling redirects.
    let docsWithoutSlash = null;
    if (config.paths.docs[config.paths.docs.length-1] != '/') {
        docsWithoutSlash = config.paths.docs;
        config.paths.docs += '/';
    }
    middlewares.push(function* (next) {
        if (this.path === docsWithoutSlash || (this.path == config.paths.docs && !this.request.query.url)) {
            const docsPath = (this.mountPath || '') + config.paths.docs;
            const specPath = (this.mountPath || '') + config.paths.spec;
            const query = this.request.search ? this.request.search + '&' : '?';
            this.redirect(docsPath + query + 'url=' + specPath);
        }
        yield next;
    });

    // Add middleware to serve the static swagger-ui files.
    middlewares.push(
        mount(config.paths.docs, serve(path.join(__dirname, '..', 'swagger-ui')))
    );

    return compose(middlewares);
};

module.exports = {
    config: buildConfig,
    middleware: createMiddleware
}
