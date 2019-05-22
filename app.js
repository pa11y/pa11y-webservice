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

const async = require('async');
const Hapi = require('@hapi/hapi');
const MongoClient = require('mongodb').MongoClient;

module.exports = initApp;

// Initialise the application
function initApp(config, callback) {

	const app = module.exports = {
		server: new Hapi.Server({
			host: config.host,
			port: config.port
		}),
		database: null,
		model: {},
		config: config
	};

	async.series([

		function(next) {
			/* eslint camelcase: 'off' */
			MongoClient.connect(config.database, {server: {auto_reconnect: false}}, function(error, db) {
				if (error) {
					console.log('Error connecting to MongoDB:');
					console.log(JSON.stringify(error));
				}

				db.on('timeout', () => {
					console.log('Mongo connection timeout');
				});

				db.on('close', () => {
					console.log('Mongo connection closed');
				});

				db.on('reconnect', () => {
					console.log('Mongo reconnected');
				});

				app.db = db;
				next(error);
			});
		},

		function(next) {
			require('./model/result')(app, function(error, model) {
				app.model.result = model;
				next(error);
			});
		},

		function(next) {
			require('./model/task')(app, function(error, model) {
				app.model.task = model;
				next(error);
			});
		},

		function(next) {
			if (!config.dbOnly && process.env.NODE_ENV !== 'test') {
				require('./task/pa11y')(config, app);
			}
			next();
		},

		function(next) {
			if (config.dbOnly) {
				return next();
			}
			require('./route/index')(app);
			require('./route/tasks')(app);
			require('./route/task')(app);
			app.server.start(next);

			console.log(`Server running at: ${app.server.info.uri}`);
		}

	], function(error) {
		callback(error, app);
	});

}
