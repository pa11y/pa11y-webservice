'use strict';

const config = module.exports = require('../.eslintrc');

// We use `this` all over the integration tests
config.rules['no-invalid-this'] = 'off';
config.rules['prefer-arrow-callback'] = 'off';

// Disable max line length/statements
config.rules['max-len'] = 'off';
config.rules['max-statements'] = 'off';
