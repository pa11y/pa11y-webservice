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

var app = require('../../app');
var config = require('../../config/test.json');
var createNavigator = require('./helper/navigate');
var loadFixtures = require('../../data/fixture/load');
var request = require('request');

// Run before all tests
before(function(done) {
	var that = this;

	that.baseUrl = 'http://localhost:' + config.port + '/';
	that.app = null;
	that.last = {};
	that.navigate = createNavigator(that.baseUrl, that.last);

	assertTestAppIsRunning(that.baseUrl, function() {
		config.dbOnly = true;
		app(config, function(error, app) {
			that.app = app;
			loadFixtures('test', config, done);
		});
	});

});

// Run after each test
afterEach(function(done) {
	loadFixtures('test', config, done);
});

// Check that the test application is running, and exit if not
function assertTestAppIsRunning(baseUrl, done) {
	request(baseUrl, function(error) {
		if (error) {
			console.error('Error: Test app not started; run with `NODE_ENV=test node index.js`');
			process.exit();
		}
		done();
	});
}
