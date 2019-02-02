export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

.PHONY: build lint test

build:
	rm -rf build/ && mkdir build/
	cp manifest.json build/
	tsc --pretty

lint:
	tslint --config tslint.json --project ./ --fix

test: build
	mocha build/test/bootstrap.js "build/test/**/*.test.js"	