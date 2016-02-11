'use strict';

const _ = require('lodash'),
      helpers = require('./helpers'),
      path = require('path'),
      url = require('url');

// Creates middleware that serves a documentation index page.
function createDocsRootMiddleware(config, urls) {
    return function* (next) {
        if (helpers.removeTrailingSlash(this.path) == config.documentation.root) {
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

module.exports = createDocsRootMiddleware;
