'use strict';

const glob = require('glob'),
      koa = require('koa'),
      path = require('path'),
      router = require('../');

const app = koa();
const specs = glob.sync(path.join(__dirname, 'specs', '*.json'));
const controllers = path.join(__dirname, 'controllers')

app.use(router({
    swaggerVersions: specs,
    controllers: controllers,
    docs: true, // swagger-ui documentation
    validate: true, // request validation
    models: true // model validation support
}));

app.use(function* (next) {
    if (this.path == '/') {
        this.redirect('/api');
    }
    yield next;
});

app.listen(3000);
console.log('Listening on port 3000\n');
