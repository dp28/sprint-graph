.PHONY: test install clean start build

install: node_modules

clean:
	rm -rf build node_modules

build: node_modules build/icons
	node ./utils/build.js

build/icons:
	rsync -r docs/icons build

start: node_modules build/icons
	NODE_ENV=development node ./utils/webserver.js

test: node_modules
	npx jest --watchAll

deployable.zip: build
	zip -r deployable.zip build/

node_modules: package.json
	npm install
	touch node_modules
