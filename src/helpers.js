'use strict';

module.exports = {
    removeTrailingSlash: function (s) {
        return s.replace(/\/+$/, '');
    },
    replaceVersion: function (s, version) {
        return s.replace(/:version/, version);
    }
}
