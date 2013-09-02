/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

// Step definitions
module.exports = function () {
	this.World = require('../support/world').World;

	this.Then(/^a task with a URL of "([^"]*)" should be present$/i, function (url, callback) {
		this.app.model.task.collection.findOne({url: url}, function (err, task) {
			if (err) {
				return callback.fail(err);
			}
			if (!task) {
				return callback.fail(new Error('Task with URL "' + url + '" not found'));
			}
			callback();
		});
	});

	this.Then(/^a task with a standard of "([^"]*)" should be present$/i, function (standard, callback) {
		this.app.model.task.collection.findOne({standard: standard}, function (err, task) {
			if (err) {
				return callback.fail(err);
			}
			if (!task) {
				return callback.fail(new Error('Task with standard "' + standard + '" not found'));
			}
			callback();
		});
	});

	this.Then(/^a task which ignores the "([^"]*)" rule should be present$/i, function(rule, callback) {
		this.app.model.task.collection.findOne({ignore: rule}, function (err, task) {
			if (err) {
				return callback.fail(err);
			}
			if (!task) {
				return callback.fail(new Error('Task with ignored rule "' + rule + '" not found'));
			}
			callback();
		});
	});

	this.Then(/^I should see a JSON representation of the new task$/i, function (callback) {
		try {
			assert.isDefined(this.body.id);
			assert.strictEqual(this.request.body.url, this.body.url);
			assert.strictEqual(this.request.body.standard, this.body.standard);
			assert.deepEqual(this.request.body.ignore || [], this.body.ignore);
		} catch (err) {
			return callback.fail(err);
		}
		callback();
	});

	this.Then(/^I should see a Location header pointing to the new task$/i, function (callback) {
		try {
			assert.isDefined(this.response.headers.location);
			assert.strictEqual(this.response.headers.location, 'http://' + this.response.request.uri.host + '/tasks/' + this.body.id);
		} catch (err) {
			return callback.fail(err);
		}
		callback();
	});

};
