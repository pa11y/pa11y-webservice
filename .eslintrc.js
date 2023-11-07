'use strict';

const config = require('pa11y-lint-config/eslint/es2017');

// Temporary overrides for this project
config.rules['object-shorthand'] = 'off';
config.rules['prefer-arrow-callback'] = 'off';
config.rules['prefer-const'] = 'off';

module.exports = config;
