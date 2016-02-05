'use strict';

module.exports = {
    preparePath: function(s, version) {
        return this.removeTrailingSlash(this.replaceVersion(s, version));
    },
    removeTrailingSlash: function (s) {
        return s.replace(/\/+$/, '');
    },
    replaceVersion: function (s, version) {
        return s.replace(/:version/, version);
    }
}
