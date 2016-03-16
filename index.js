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

var chalk = require('chalk');
var config = require('./config/' + (process.env.NODE_ENV || 'development') + '.json');

require('./app')(config, function (err, app) {
	console.log('');
	console.log(chalk.underline.cyan('pa11y-webservice started'));
	console.log(chalk.grey('mode: %s'), process.env.NODE_ENV);
	console.log(chalk.grey('uri:  %s'), app.server.info.uri);
	
	if (err) {
		console.error('');
		console.error(chalk.red('Error starting pa11y-webservice:'));
		console.error(err.message);
	}
});
