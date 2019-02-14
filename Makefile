export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

.PHONY: build lint test unit acceptance

build:
	rm -rf build/ && mkdir build/
	rsync -a src/ build/src/ --exclude '*.ts'
	rsync -a test/ build/test/ --exclude '*.ts'
	cp manifest.json build/
	tsc --pretty

lint:
	tslint --config tslint.json --project ./ --fix

unit:
	mocha build/test/bootstrap.js "build/test/unit/**/*.test.js"	

acceptance:
	mocha build/test/bootstrap.js "build/test/acceptance/**/*.test.js"

test: build unit acceptance lint