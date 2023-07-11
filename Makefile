.PHONY: clean

clean:
	rm -rf deployable.zip

deployable.zip:
	zip -r deployable.zip src/
