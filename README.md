# fleek-versioned-router

This extends [fleek-router](https://github.com/fleekjs/fleek-router)
to use multiple swagger spec versions.

Each swagger spec file should use a different `basePath` values.

Requests for API versions can be made using an API's `basePath`,
or by sending an `X-Api-Version` header.

For example, with `basePath: /api/1.0.0` in a swagger spec:

* `curl http://localhost:3000/api/1.0.0/pet/1`
* `curl -H "X-Api-Version: 1.0.0" http://localhost:3000/pet/1`

## Installation

This is not on NPM yet!

## Example

See the [example](example/) directory for an example project.

```javascript
const glob = require('glob'),
      koa = require('koa'),
      path = require('path'),
      router = require('fleek-versioned-router');

const app = koa();
const specs = glob.sync(path.join(__dirname, 'specs', '*.json'));
const controllers = path.join(__dirname, 'controllers')

app.use(router({
    swaggerVersions: specs,  // swagger spec filenames
    controllers: controllers,  // controllers directory
    docs: true, // swagger-ui documentation
    validate: true, // request validation
    models: true // model validation support
}));

app.listen(3000);
```

## Controllers

Read [fleek-router](https://github.com/fleekjs/fleek-router)
for more about how controllers and routes work.

fleek-versioned-router is able to work because **different specs have
different values for `basePath`**. The behavior is unknown when paths clash.

In fleek-versioned-router, a controller might be called by more than one spec.
To find out which one was used for a request, access `this.fleek.swagger`
from within the controller.

## Configuration

The configuration options are almost the same as in
[fleek-router](https://github.com/fleekjs/fleek-router#configuration),
with some key differences:

1. Must set `config.swaggerVersions` instead of `config.swagger`
1. Optionally set `config.docs` instead of `config.documentation`
1. Optionally set `config.models` to enable a model validation

### config.swaggerVersions

#### required

Rather than setting `config.swagger` as in
[fleek-router](https://github.com/fleekjs/fleek-router#configswagger),
set `config.swaggerVersions` to specify a list of swagger specs.

#### accepts

* `Array` - list of paths for the swagger specs

```javascript
config.swaggerVersions = ['specs/v1.json', 'specs/v2.json'];
```

### config.docs

#### optional

Rather than setting `config.documentation` as in,
[fleek-router](https://github.com/fleekjs/fleek-router)
set `config.docs` to enable the following documentation features
for all spec versions.

* documentation root endpoint
    * returns all swagger spec versions and their relevant URLs as JSON
* spec file endpoint for each version
    * returns a swagger spec
* swagger-ui endpoint for each version
    * [swagger-ui](https://github.com/swagger-api/swagger-ui)
      for browsing/testing a swagger spec version

#### accepts

* `Boolean` - if set to true, enables documentation with default paths
* `Object` - specify custom paths

```javascript
// true defaults to the following:
config.docs = {
    root: '/api',
    paths: {
        docs: '/docs/:version',
        spec: '/api/:version'
    }
};
```

### config.models

#### optional

Enable this for model validation features.

#### accepts

* `Boolean` - if set to true, enables model validation features

#### usage in controllers

Call `this.fleek.validateModel(modelName, data)` from a controller to validate
and return model data, or return a validation error response if the data was
not allowed by the current spec.

```javascript
this.body = this.fleek.validateModel('User', {
    id: 1,
    name: 'Douglas Quaid'
});
```

### config.middleware

This option is the same as in
[fleek-router](https://github.com/fleekjs/fleek-router#configmiddleware)
but an example for fleek-versioned-router may be useful.

#### example

```
config.middleware = function*(next) {
    // Add shortcuts for the relevant spec version.
    this.spec = this.fleek.swagger;
    this.version = this.spec.info.version;
    this.model = this.fleek.validateModel;
    yield next;
}
```

## Development

To work on fleek-versioned-router, check out the code and then run:

```
npm install
npm test
npm start
```

There are also Make commands, see the [Makefile](Makefile) to find out more.
