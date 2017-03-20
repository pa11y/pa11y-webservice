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

var environment = process.env.NODE_ENV || 'development';
var loadFixtures = require('../data/fixture/load');

loadFixtures(environment, require('../config/' + environment + '.json'), function(error) {
	if (error) {
		console.error(error.stack);
		return process.exit(1);
	}
	console.log('Fixtures added');
});
