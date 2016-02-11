'use strict';

const _ = require('lodash'),
      compose = require('koa-compose'),
      helpers = require('./helpers'),
      mount = require('koa-mount'),
      path = require('path'),
      serve = require('koa-static');

// Creates middleware to serve documentation.
function createMiddleware(_config) {
    const config = _.cloneDeep(_config);
    const middlewares = [];

    // Add middleware to serve the spec document.
    const specPath = config.documentation.spec;
    middlewares.push(function* (next) {
        if (this.path == specPath) {
            this.body = config.swagger;
        };
        yield next;
    });

    // Add middleware for handling redirects.
    let docsPath = config.documentation.docs;
    let docsWithoutSlash = null;
    if (_.endsWith(docsPath, '/') === false) {
        docsWithoutSlash = docsPath;
        docsPath += '/';
    }
    middlewares.push(function* (next) {
        if (this.path === docsWithoutSlash || (this.path == docsPath && !this.request.query.url)) {
            const absoluteDocsPath = (this.mountPath || '') + docsPath;
            const absoluteSpecPath = (this.mountPath || '') + specPath;
            const query = this.request.search ? this.request.search + '&' : '?';
            this.redirect(absoluteDocsPath + query + 'url=' + absoluteSpecPath);
        }
        yield next;
    });

    // Add middleware to serve the static swagger-ui files.
    middlewares.push(
        mount(docsPath, serve(path.join(__dirname, '..', 'swagger-ui')))
    );

    return compose(middlewares);
};

module.exports = createMiddleware;
