/* jshint maxlen: 200 */
'use strict';

// Step definitions
module.exports = function () {
	this.World = require('../support/world').World;

	this.When(/^I (GET|POST|PUT|DELETE) the "([^"]*)" endpoint$/i, function (method, endpoint, callback) {
		method = method.toUpperCase();
		this.navigate(endpoint, {method: method}, function (err) {
			if (err) {
				return callback.fail(new Error('Could not ' + method + ' the "' + endpoint + '" endpoint'));
			}
			callback();
		});
	});

	this.When(/^I (GET|POST|PUT|DELETE) the "([^"]*)" endpoint with JSON:$/i, function (method, endpoint, json, callback) {
		method = method.toUpperCase();
		this.navigate(endpoint, {method: method, body: JSON.stringify(JSON.parse(json))}, function (err) {
			if (err) {
				return callback.fail(new Error('Could not ' + method + ' the "' + endpoint + '" endpoint'));
			}
			callback();
		});
	});

	this.When(/^I (GET|POST|PUT|DELETE) the "([^"]*)" endpoint with query:$/i, function (method, endpoint, query, callback) {
		method = method.toUpperCase();
		this.navigate(endpoint, {method: method, query: JSON.parse(query)}, function (err) {
			if (err) {
				return callback.fail(new Error('Could not ' + method + ' the "' + endpoint + '" endpoint'));
			}
			callback();
		});
	});

	this.Then(/^I should get a (\d+) response$/i, function (status, callback) {
		status = parseInt(status, 10);
		if (this.status !== status) {
			return callback.fail(new Error('Status is ' + this.status));
		}
		callback();
	});

};
