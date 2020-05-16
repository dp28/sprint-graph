.PHONY: test install clean

install: node_modules

clean:
	rm -rf build node_modules

test: node_modules
	npx jest --watchAll

node_modules: package.json
	npm install
	touch node_modules
