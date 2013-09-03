/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

// Step definitions
module.exports = function () {
	this.World = require('../support/world').World;

	this.Given(/^I have the results:$/i, function (results, callback) {
		var that = this;
		async.parallel(JSON.parse(results).map(function (result) {
			return function (next) {
				if (result._id) {
					result._id = new ObjectID(result._id);
				}
				that.app.model.result.create(result, next);
			};
		}), function (err) {
			if (err) {
				return callback.fail();
			}
			callback();
		});
	});

	this.Then(/^I should see a JSON representation of all results sorted by date$/i, function (callback) {
		var that = this;
		this.app.model.result.collection.find().sort({date: -1}).toArray(function (err, results) {
			if (err) {
				return callback.fail(err);
			}
			results = results.map(that.app.model.result.prepareForOutput);
			try {
				assert.strictEqual(JSON.stringify(that.body), JSON.stringify(results));
			} catch (err) {
				return callback.fail(err);
			}
			callback();
		});
	});

	this.Then(/^I should see a JSON representation of all results sorted by date with full details$/i, function (callback) {
		var that = this;
		this.app.model.result.collection.find().sort({date: -1}).toArray(function (err, results) {
			if (err) {
				return callback.fail(err);
			}
			results = results.map(that.app.model.result.prepareForFullOutput);
			try {
				assert.strictEqual(JSON.stringify(that.body), JSON.stringify(results));
			} catch (err) {
				return callback.fail(err);
			}
			callback();
		});
	});

	this.Then(/^I should see a JSON representation of result "([^"]*)"$/i, function (id, callback) {
		var hasResultWithId = !!this.body.filter(function (result) {
			return result.id === id;
		}).length;
		if (!hasResultWithId) {
			return callback.fail(new Error('Result with ID "' + id + '" not found'));
		}
		callback();
	});

	this.Then(/^I should not see a JSON representation of result "([^"]*)"$/i, function (id, callback) {
		var hasResultWithId = !!this.body.filter(function (result) {
			return result.id === id;
		}).length;
		if (hasResultWithId) {
			return callback.fail(new Error('Result with ID "' + id + '" was found'));
		}
		callback();
	});

};
