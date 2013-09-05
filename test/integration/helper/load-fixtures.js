'use strict';

var async = require('async');
var clearDatabase = require('./clear-database');
var resultFixtures = require('../fixture/results');
var taskFixtures = require('../fixture/tasks');

module.exports = loadFixtures;

// Load fixture data into the database (after clearing it)
function loadFixtures (app, done) {
	clearDatabase(app, function (err) {
		if (err) {
			return done(err);
		}

		async.series([

			function (next) {
				async.parallel(taskFixtures.map(function (task) {
					return app.model.task.create.bind(null, task);
				}), next);
			},

			function (next) {
				async.parallel(resultFixtures.map(function (result) {
					return app.model.result.create.bind(null, result);
				}), next);
			}

		], done);

	});
}
