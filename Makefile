
# Color helpers
C_CYAN=\x1b[34;01m
C_RESET=\x1b[0m

# Group targets
all: deps lint test
ci: lint test

# Install dependencies
deps:
	@echo "$(C_CYAN)> installing dependencies$(C_RESET)"
	@npm install

# Lint JavaScript
lint: jshint jscs

# Run JSHint
jshint:
	@echo "$(C_CYAN)> linting javascript$(C_RESET)"
	@./node_modules/.bin/jshint .

# Run JavaScript Code Style
jscs:
	@echo "$(C_CYAN)> checking javascript code style$(C_RESET)"
	@./node_modules/.bin/jscs .

# Run all tests
test: test-integration

# Run integration tests
test-integration:
	@echo "$(C_CYAN)> running integration tests$(C_RESET)"
	@./node_modules/.bin/mocha ./test/integration --reporter spec --recursive --timeout 5000 --slow 50

# Add fixtures
fixtures:
	@echo "$(C_CYAN)> adding fixtures$(C_RESET)"
	@node ./script/fixtures.js

.PHONY: test
