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

const Hapi = require('@hapi/hapi');
const MongoClient = require('mongodb').MongoClient;

module.exports = initApp;

// Initialise the application
async function initApp(config, callback) {

	const app = {
		server: new Hapi.Server({
			host: config.host,
			port: config.port
		}),
		db: null,
		model: {},
		config: config
	};

	/* eslint camelcase: 'off' */
	await MongoClient.connect(config.database, {
		autoReconnect: false,
		useNewUrlParser: true
	}).then(client => {
		app.db = client.db();

		app.db.on('timeout', () => {
			console.log('Mongo connection timeout');
		});

		app.db.on('close', () => {
			console.log('Mongo connection closed');
		});

		app.db.on('reconnect', () => {
			console.log('Mongo reconnected');
		});
	}).catch(error => {
		console.log('Error connecting to MongoDB:');
		callback(error);
	});

	await require('./model/result')(app, function(errors, model) {
		if (errors) {
			console.error('Setting up result model had some errors:');
			console.error(errors);
		}
		app.model.result = model;
	});

	await require('./model/task')(app, function(errors, model) {
		if (errors) {
			console.error('Setting up task model had some errors:');
			console.error(errors);
		}
		app.model.task = model;
	});

	if (!config.dbOnly && process.env.NODE_ENV !== 'test') {
		await require('./task/pa11y')(config, app);
	}

	if (!config.dbOnly) {
		await require('./route/index')(app);
		await require('./route/tasks')(app);
		await require('./route/task')(app);
		await app.server.start();

		console.log(`Server running at: ${app.server.info.uri}`);
	}
	callback(null, app);
}
