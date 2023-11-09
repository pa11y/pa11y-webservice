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

const app = require('../../app');
const createNavigator = require('./helper/navigate');
const loadFixtures = require('../../data/fixture/load');
const request = require('request');

const config = {
	database: process.env.DATABASE || 'mongodb://127.0.0.1/pa11y-webservice-test',
	host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT || 3000
};

before(function(done) {
	this.baseUrl = `http://${config.host}:${config.port}/`;
	this.app = null;
	this.last = {};
	this.navigate = createNavigator(this.baseUrl, this.last);

	assertServiceIsAvailable(this.baseUrl, () => {
		config.dbOnly = true;
		app(config, (error, initialisedApp) => {
			this.app = initialisedApp;
			loadFixtures('test', config, done);
		});
	});
});

afterEach(done => {
	loadFixtures('test', config, done);
});

function assertServiceIsAvailable(baseUrl, done) {
	request(baseUrl, error => {
		if (error) {
			console.error(`Error: Test app not started. NODE_ENV was ${process.env.NODE_ENV}; run with \`NODE_ENV=test node index.js\``);
			process.exit();
		}
		done();
	});
}
