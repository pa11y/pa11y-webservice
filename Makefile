include Makefile.node


# Verify tasks
# ------------

# Lint alias for backwards compatibility
lint: verify


# Database tasks
# --------------

# Add fixtures
fixtures:
	@node ./script/fixtures.js
	@$(TASK_DONE)
