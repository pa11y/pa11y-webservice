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

const {promisify} = require('util');

const databaseChecker = require('../../app');
const createNavigator = require('./helper/navigate');
const loadFixtures = require('../../data/fixture/load');

const config = {
	database: process.env.DATABASE || 'mongodb://127.0.0.1/pa11y-webservice-test',
	host: process.env.HOST || '0.0.0.0',
	port: Number(process.env.PORT) || 3000,
	dbOnly: true
};

async function assertServiceIsAvailable(baseUrl) {
	try {
		const response = await fetch(baseUrl);
		if (!response.ok) {
			console.error('Service found but returned an error. HTTP status:', response.status);
			throw Error();
		}
	} catch (error) {
		console.error('Service under test not found or returned error.');
		throw error;
	}
}

before(async function() {
	this.baseUrl = `http://${config.host}:${config.port}/`;
	this.last = {};

	await assertServiceIsAvailable(this.baseUrl);

	this.app = await promisify(databaseChecker)(config);
	await loadFixtures('test', config);

	this.navigate = createNavigator(this.baseUrl, this.last);
});

afterEach(async () => {
	await loadFixtures('test', config);
});
