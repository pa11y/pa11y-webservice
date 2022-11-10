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

const {cyan, grey, red, underline} = require('kleur');
const URL = require('url').URL;
const config = require('./config');

process.on('SIGINT', () => {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	process.exit();
});

const app = require('./app');

app(config, (error, initialisedApp) => {
	// Formats the mongodb connection string for display purposes so that it
	//  hides the username and password in order to avoid potentially
	//  leaking database credentials in, for example, CI logs. Fixes #123.
	const dbConnectionString = new URL(config.database);
	dbConnectionString.username = '****';
	dbConnectionString.password = '****';

	console.log('');
	console.log(underline(cyan('Pa11y Webservice started')));
	console.log(grey('mode:     %s'), process.env.NODE_ENV);
	console.log(grey('uri:      %s'), initialisedApp.server.info.uri);
	console.log(grey('database: %s'), dbConnectionString);
	console.log(grey('cron:     %s'), config.cron);
	console.log(grey('workers:  %s'), config.numWorkers);
	console.log(grey('runners:  %s'), config.runners);

	if (error) {
		console.error('');
		console.error(red('Error starting Pa11y Webservice:'));
		console.error(error.message);
	}
});
