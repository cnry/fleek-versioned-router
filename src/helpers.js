'use strict';

module.exports = {
    removeTrailingSlash: function (s) {
        return s.replace(/\/+$/, '');
    },
    replaceVersion: function (s, version) {
        return s.replace(/:version/, version);
    },
    versionedPath: function (path, version) {
        return this.removeTrailingSlash(this.replaceVersion(path, version));
    }
}
