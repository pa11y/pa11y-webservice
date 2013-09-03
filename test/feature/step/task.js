/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

// Step definitions
module.exports = function () {
	this.World = require('../support/world').World;

	this.Given(/^I have the tasks:$/i, function (tasks, callback) {
		var that = this;
		async.parallel(tasks.hashes().map(function (task) {
			return function (next) {
				task._id = new ObjectID(task._id);
				that.app.model.task.create(task, next);
			};
		}), function (err) {
			if (err) {
				return callback.fail();
			}
			callback();
		});
	});

	this.Then(/^the new task should be added to the database$/i, function (callback) {
		this.app.model.task.collection.findOne(this.request.body, function (err, task) {
			if (err) {
				return callback.fail(err);
			}
			if (!task) {
				return callback.fail(new Error('Task not found'));
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

	this.Then(/^I should see a JSON representation of all tasks sorted by URL\/standard$/i, function (callback) {
		var that = this;
		this.app.model.task.collection.find().sort({url: 1, standard: 1}).toArray(function (err, tasks) {
			if (err) {
				return callback.fail(err);
			}
			tasks = tasks.map(that.app.model.task.prepareForOutput);
			try {
				assert.strictEqual(JSON.stringify(that.body), JSON.stringify(tasks));
			} catch (err) {
				return callback.fail(err);
			}
			callback();
		});
	});

	this.Then(/^I should see a JSON representation of task "([^"]*)"$/i, function (id, callback) {
		var that = this;
		this.app.model.task.collection.findOne({_id: new ObjectID(id)}, function (err, task) {
			if (err) {
				return callback.fail(err);
			}
			if (!task) {
				return callback.fail(new Error('Task with ID "' + id + '" not found'));
			}
			task = that.app.model.task.prepareForOutput(task);
			try {
				assert.strictEqual(JSON.stringify(that.body), JSON.stringify(task));
			} catch (err) {
				return callback.fail(err);
			}
			callback();
		});
	});

};
