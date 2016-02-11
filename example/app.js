'use strict';

const glob = require('glob'),
      koa = require('koa'),
      path = require('path'),
      router = require('../');

const app = koa();
const specs = glob.sync(path.join(__dirname, 'specs', '*.json'));
const controllers = path.join(__dirname, 'controllers')

app.use(router({
    swaggerVersions: specs,  // swagger spec filenames
    controllers: controllers,  // controllers directory
    documentation: true, // swagger-ui documentation
    validate: true, // request validation
    models: true, // model validation support
    middleware: function*(next) {
        // Add shortcuts for the relevant spec version.
        this.spec = this.fleek.swagger;
        this.version = this.spec.info.version;
        this.model = this.fleek.validateModel;
        yield next;
    }
}));

app.use(function* (next) {
    if (this.path == '/') {
        this.redirect('/api');
    }
    yield next;
});

module.exports = app;

if (!module.parent) {
    app.listen(3000);
    console.log('Listening on port 3000\n');
}
