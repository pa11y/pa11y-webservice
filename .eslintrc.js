'use strict';

const config = module.exports = require('pa11y-lint-config/eslint/es6');

// NOTE: we have to override here because we're using
// a `for of` loop somewhere. Once this repo moves to
// ES6 syntax, we can remove most of this

// ES5 overrides
config.rules['no-var'] = 'off';
config.rules['object-shorthand'] = 'off';
config.rules['prefer-arrow-callback'] = 'off';
config.rules['prefer-const'] = 'off';
config.rules['prefer-rest-params'] = 'off';
config.rules['prefer-spread'] = 'off';
config.rules['prefer-template'] = 'off';
