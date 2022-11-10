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

const fs = require('fs');
const path = require('path');
const assert = require('proclaim');

describe('config', () => {

	const mockNodeEnv = 'mock';
	let originalNodeEnv = 'test';

	const mockConfig = {
		database: 'config-file-db',
		host: 'config-file-host',
		port: 1000,
		cron: 'config-fille-cron',
		numWorkers: 2,
		chromeLaunchConfig: {
			field: 'value'
		},
		runners: ['htmlcs']
	};

	before(() => {
		console.log('NODE_ENV', process.env.NODE_ENV);
		originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = mockNodeEnv;
	});

	after(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	describe('with a file', () => {

		const configFilePath = path.resolve(path.join(__dirname, '../../config/mock.json'));

		before(done => {
			fs.writeFile(configFilePath, JSON.stringify(mockConfig), done);
		});

		after(done => {
			fs.unlink(configFilePath, done);
		});

		describe('and no environment variables', () => {

			it('provides the config file', () => {
				delete require.cache[require.resolve('../../config')];
				const config = require('../../config');

				assert.strictEqual(config.database, mockConfig.database);
				assert.strictEqual(config.host, mockConfig.host);
				assert.strictEqual(config.port, mockConfig.port);
				assert.strictEqual(config.cron, mockConfig.cron);
				assert.strictEqual(config.numWorkers, mockConfig.numWorkers);
				assert.deepEqual(config.runners, mockConfig.runners);
				assert.deepEqual(config.chromeLaunchConfig, mockConfig.chromeLaunchConfig);
			});

		});

		describe('and some environment variables', () => {

			beforeEach(() => {
				process.env.DATABASE = 'env-db';
				process.env.PORT = '2000';
			});

			afterEach(() => {
				delete process.env.DATABASE;
				delete process.env.PORT;
			});

			it('overrides the file with the environment variables', () => {
				delete require.cache[require.resolve('../../config')];
				const config = require('../../config');

				assert.strictEqual(config.database, 'env-db');
				assert.strictEqual(config.host, mockConfig.host);
				assert.strictEqual(config.port, 2000);
				assert.strictEqual(config.cron, mockConfig.cron);
				assert.strictEqual(config.numWorkers, mockConfig.numWorkers);
				assert.deepEqual(config.runners, mockConfig.runners);
				assert.deepEqual(config.chromeLaunchConfig, mockConfig.chromeLaunchConfig);
			});
		});
	});

	describe('with no file', () => {

		describe('and no environment variables', () => {

			it('provides a default configuration', () => {
				delete require.cache[require.resolve('../../config')];
				const config = require('../../config');

				assert.strictEqual(config.database, 'mongodb://localhost/pa11y-webservice');
				assert.strictEqual(config.host, '0.0.0.0');
				assert.strictEqual(config.port, 3000);
				assert.strictEqual(config.cron, false);
				assert.deepEqual(config.chromeLaunchConfig, {});
			});
		});

		describe('and environment variables', () => {

			beforeEach(() => {
				process.env.DATABASE = 'env-db-2';
				process.env.HOST = 'env-host-2';
				process.env.PORT = '3000';
				process.env.CRON = 'env-cron-2';
				process.env.NUM_WORKERS = 4;
			});

			afterEach(() => {
				delete process.env.DATABASE;
				delete process.env.HOST;
				delete process.env.PORT;
				delete process.env.CRON;
			});

			it('provides a config using those variables', () => {
				delete require.cache[require.resolve('../../config')];
				const config = require('../../config');

				assert.strictEqual(config.database, 'env-db-2');
				assert.strictEqual(config.host, 'env-host-2');
				assert.strictEqual(config.port, 3000);
				assert.strictEqual(config.cron, 'env-cron-2');
				assert.strictEqual(config.numWorkers, 4);
				assert.deepEqual(config.chromeLaunchConfig, {});
			});
		});
	});
});
