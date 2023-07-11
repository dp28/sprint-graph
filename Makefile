.PHONY: install clean

install: node_modules

clean: deployable.zip
	rm -rf node_modules

deployable.zip:
	zip -r deployable.zip src/

node_modules: package.json
	npm install
	touch node_modules
