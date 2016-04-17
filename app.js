// This file is part of pa11y-webservice.
//
// pa11y-webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// pa11y-webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with pa11y-webservice.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

var async = require('async');
var Hapi = require('hapi');
var MongoClient = require('mongodb').MongoClient;

module.exports = initApp;

// Initialise the application
function initApp(config, callback) {

	var app = module.exports = {
		server: new Hapi.Server(config.host, config.port, {}),
		database: null,
		model: {}
	};

	async.series([

		function(next) {
			MongoClient.connect(config.database, {server: {auto_reconnect: false}}, function(err, db) {
				app.db = db;
				next(err);
			});
		},

		function(next) {
			require('./model/result')(app, function(err, model) {
				app.model.result = model;
				next(err);
			});
		},

		function(next) {
			require('./model/task')(app, function(err, model) {
				app.model.task = model;
				next(err);
			});
		},

		function(next) {
			if (!config.dbOnly && process.env.NODE_ENV !== 'test') {
				require('./task/pa11y')(config, app);
			}
			next();
		},

		function(next) {
			if (!config.dbOnly) {
				app.server.addRoutes(require('./route/tasks')(app));
				app.server.addRoutes(require('./route/task')(app));
				app.server.start(next);
			} else {
				next();
			}
		}

	], function(err) {
		callback(err, app);
	});

}
