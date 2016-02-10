# See http://clarkgrubb.com/makefile-style-guide

MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

example_files = $(shell find example -type f)
src_files = $(shell find src -type f)
test_files = $(shell find tests -type f)

.PHONY: all
all: node_modules

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: run server start
run server start: node_modules $(example_files) $(src_files)
	@npm start

.PHONY: test tests
test tests: node_modules $(example_files) $(src_files) $(test_files)
	@npm test

.PHONY: update deps
update deps:
	npm install

node_modules: package.json
	npm install
