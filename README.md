# fleek-versioned-router

This extends [`fleek-router`](https://github.com/fleekjs/fleek-router)
to support the use of multiple swagger versions at once.

**Note: this is not on NPM yet, and only the bare minimum work
has been done to get this working in one particular project.**

## Usage

1. Set `config.swaggerVersions` instead of `config.swagger`
1. Set `config.docs` instead of `config.documentation`
1. Access `this.fleek.swagger` in controllers to get the swagger document
   used in the request.
