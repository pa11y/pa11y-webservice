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

var chalk = require('chalk');
var config = require('./config');

process.on('SIGINT', function() {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	process.exit();
});

require('./app')(config, function(error, app) {
	console.log('');
	console.log(chalk.underline.cyan('Pa11y Webservice started'));
	console.log(chalk.grey('mode:     %s'), process.env.NODE_ENV);
	console.log(chalk.grey('uri:      %s'), app.server.info.uri);
	console.log(chalk.grey('database: %s'), config.database);
	console.log(chalk.grey('cron:     %s'), config.cron);

	if (error) {
		console.error('');
		console.error(chalk.red('Error starting Pa11y Webservice:'));
		console.error(error.message);
	}
});
