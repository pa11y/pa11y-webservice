'use strict';

const config = require('pa11y-lint-config/eslint/es2017');

// Temporary overrides for this project
config.rules['prefer-arrow-callback'] = 'off';

module.exports = config;
