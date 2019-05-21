// This file is part of Pa11y Webservice.
//
// Pa11y Webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Pa11y Webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Pa11y Webservice.  If not, see <http://www.gnu.org/licenses/>.
'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('proclaim');

describe('config', function() {
	var mockNodeEnv = 'mock';
	var originalNodeEnv = 'test';

	var mockConfig = {
		database: 'config-file-db',
		host: 'config-file-host',
		port: 1000,
		cron: 'config-fille-cron',
		chromeLaunchConfig: {
			field: 'value'
		}
	};

	before(function() {
		console.log('NODE_ENV', process.env.NODE_ENV);
		originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = mockNodeEnv;
	});

	after(function() {
		process.env.NODE_ENV = originalNodeEnv;
	});

	describe('with a file', function() {
		var configFilePath = path.resolve(path.join(__dirname, '../../config/mock.json'));

		before(function(done) {
			fs.writeFile(configFilePath, JSON.stringify(mockConfig), done);
		});

		after(function(done) {
			fs.unlink(configFilePath, done);
		});

		describe('and no environment variables', function() {

			it('provides the config file', function() {
				delete require.cache[require.resolve('../../config')];
				var config = require('../../config');

				assert.strictEqual(config.database, mockConfig.database);
				assert.strictEqual(config.host, mockConfig.host);
				assert.strictEqual(config.port, mockConfig.port);
				assert.strictEqual(config.cron, mockConfig.cron);
				assert.deepEqual(config.chromeLaunchConfig, mockConfig.chromeLaunchConfig);
			});
		});

		describe('and some environment variables', function() {

			beforeEach(function() {
				process.env.DATABASE = 'env-db';
				process.env.PORT = '2000';
			});

			afterEach(function() {
				delete process.env.DATABASE;
				delete process.env.PORT;
			});

			it('overrides the file with the environment variables', function() {
				delete require.cache[require.resolve('../../config')];
				var config = require('../../config');

				assert.strictEqual(config.database, 'env-db');
				assert.strictEqual(config.host, mockConfig.host);
				assert.strictEqual(config.port, 2000);
				assert.strictEqual(config.cron, mockConfig.cron);
				assert.deepEqual(config.chromeLaunchConfig, mockConfig.chromeLaunchConfig);
			});
		});
	});

	describe('with no file', function() {

		describe('and no environment variables', function() {

			it('provides a default configuration', function() {
				delete require.cache[require.resolve('../../config')];
				var config = require('../../config');

				assert.strictEqual(config.database, 'mongodb://localhost/pa11y-webservice');
				assert.strictEqual(config.host, '0.0.0.0');
				assert.strictEqual(config.port, 3000);
				assert.strictEqual(config.cron, false);
				assert.deepEqual(config.chromeLaunchConfig, {});
			});
		});

		describe('and environment variables', function() {

			beforeEach(function() {
				process.env.DATABASE = 'env-db-2';
				process.env.HOST = 'env-host-2';
				process.env.PORT = '3000';
				process.env.CRON = 'env-cron-2';
			});

			afterEach(function() {
				delete process.env.DATABASE;
				delete process.env.HOST;
				delete process.env.PORT;
				delete process.env.CRON;
			});

			it('provides a config using those variables', function() {
				delete require.cache[require.resolve('../../config')];
				var config = require('../../config');

				assert.strictEqual(config.database, 'env-db-2');
				assert.strictEqual(config.host, 'env-host-2');
				assert.strictEqual(config.port, 3000);
				assert.strictEqual(config.cron, 'env-cron-2');
				assert.deepEqual(config.chromeLaunchConfig, {});
			});
		});
	});
});
