'use strict';

const {defineConfig} = require('eslint/config');

const configPa11y = require('eslint-config-pa11y');

module.exports = defineConfig([
	configPa11y,
	{
		files: ['test/**/*.js'],
		rules: {
			'prefer-arrow-callback': 'off',
			'no-invalid-this': 'off',
			'n/no-unsupported-features/node-builtins': ['error', {
				ignores: ['fetch']
			}]
		}
	},
	{
		files: ['data/fixture/**/*.js'],
		rules: {
			'max-len': 'off',
			'max-statements': 'off'
		}
	}
]);
