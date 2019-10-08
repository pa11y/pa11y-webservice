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

const fs = require('fs');
const jsonPath = `./config/${process.env.NODE_ENV || 'development'}.json`;

if (fs.existsSync(jsonPath)) {
	const jsonConfig = require(jsonPath);

	module.exports = {
		database: env('DATABASE', jsonConfig.database),
		host: env('HOST', jsonConfig.host),
		port: Number(env('PORT', jsonConfig.port)),
		runners: possibleCsvListToArray(env('RUNNERS', jsonConfig.runners)),
		cron: env('CRON', jsonConfig.cron),
		chromeLaunchConfig: jsonConfig.chromeLaunchConfig || {}
	};
} else {
	module.exports = {
		database: env('DATABASE', 'mongodb://localhost/pa11y-webservice'),
		host: env('HOST', '0.0.0.0'),
		port: Number(env('PORT', '3000')),
		runners: env('RUNNERS', ['htmlcs', 'axe']),
		cron: env('CRON', false),
		chromeLaunchConfig: {}
	};
}

function env(name, defaultValue) {
	const value = process.env[name];
	return (typeof value === 'string' ? value : defaultValue);
}

function possibleCsvListToArray(value) {
	if (Array.isArray(value)) {
		return value;
	} else if (typeof value === 'string') {
		return value.split(',').forEach(item => item.trim());
	}
	throw new TypeError('You have passed an empty string/array or invalid type to this function.  Please make sure you have specified a string or array.');
}
