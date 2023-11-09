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
const {URL} = require('url');
const config = require('./config');

process.on('SIGINT', () => {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	process.exit();
});


console.log(underline(cyan('\nPa11y Webservice starting')));
console.log(grey('mode:        %s'), process.env.NODE_ENV);
console.log(grey('database:    %s'), hideCredentialsInConnectionString(config.database));
console.log(grey('cron:        %s'), config.cron);
console.log(grey('workers:     %s'), config.numWorkers);

const app = require('./app');

function hideCredentialsInConnectionString(connectionString) {
	const url = new URL(connectionString);
	url.username = '****';
	url.password = '****';
	return url.toString();
}

app(config, (error, {server}) => {
	if (error) {
		console.error(red('\nError starting Pa11y Webservice:'));
		console.error(error.message);
	} else {
		console.log(underline(cyan('\nPa11y Webservice started')));
	}
	console.log(grey('service uri: %s'), server.info.uri);
});
