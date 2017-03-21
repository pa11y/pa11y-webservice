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
var async = require('async');

module.exports = loadFixtures;

function loadFixtures(env, config, done) {
	env = (env || 'development');
	var fixtures = {
		results: require('./' + env + '/results.js'),
		tasks: require('./' + env + '/tasks.js')
	};

	config.dbOnly = true;

	app(config, function(error, app) {
		if (error) {
			done(error);
		}
		async.series([
			clearDatabase.bind(null, app),
			insertFixtures.bind(null, app, fixtures)
		], function() {
			app.db.close();
			done();
		});
	});
}

function clearDatabase(app, done) {
	async.parallel([
		app.model.result.collection.remove.bind(app.model.result.collection),
		app.model.task.collection.remove.bind(app.model.task.collection)
	], done);
}

function insertFixtures(app, fixtures, done) {
	async.series([

		function(next) {
			async.parallel(fixtures.tasks.map(function(task) {
				return app.model.task.create.bind(null, task);
			}), next);
		},

		function(next) {
			async.parallel(fixtures.results.map(function(result) {
				return app.model.result.create.bind(null, result);
			}), next);
		}

	], done);
}
