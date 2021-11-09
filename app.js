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
const {MongoClient} = require('mongodb');

module.exports = initApp;

// Initialise the application
function initApp(config, callback) {

	const app = {
		server: new Hapi.Server({
			host: config.host,
			port: config.port
		}),
		db: null,
		client: null,
		model: {},
		config: config
	};

	const url = config.database;
	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	async.series([
		next => {
			/* eslint camelcase: 'off' */

			client.connect(error => {
				console.log('Connected successfully to server');
				const db = client.db();
				app.client = client;
				app.db = db;

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

		next => {
			require('./model/result')(app, (error, model) => {
				app.model.result = model;
				next(error);
			});
		},

		next => {
			require('./model/task')(app, (error, model) => {
				app.model.task = model;
				next(error);
			});
		},

		next => {
			if (!config.dbOnly && process.env.NODE_ENV !== 'test') {
				require('./task/pa11y')(config, app);
			}
			next();
		},

		next => {
			if (config.dbOnly) {
				return next();
			}

			require('./route/index')(app);
			require('./route/tasks')(app);
			require('./route/task')(app);

			app.server.start()
				.then(
					() => next(),
					error => next(error)
				);

			console.log(`Server running at: ${app.server.info.uri}`);
		}

	], error => callback(error, app));

}
