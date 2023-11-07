include Makefile.node

# Add fixtures to database
fixtures:
	@node ./script/fixtures.js
	@$(TASK_DONE)
