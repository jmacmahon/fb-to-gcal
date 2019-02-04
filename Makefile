export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

.PHONY: build lint test unit

build:
	rm -rf build/ && mkdir build/
	cp manifest.json build/
	tsc --pretty

lint:
	tslint --config tslint.json --project ./ --fix

unit:
	mocha build/test/bootstrap.js "build/test/**/*.test.js"	

test: build unit lint