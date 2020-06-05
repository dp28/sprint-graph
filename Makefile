.PHONY: test install clean start build

install: node_modules

clean:
	rm -rf build node_modules

build: node_modules
	node ./utils/build.js

start: node_modules
	NODE_ENV=development node ./utils/webserver.js

test: node_modules
	npx jest --watchAll

node_modules: package.json
	npm install
	touch node_modules
