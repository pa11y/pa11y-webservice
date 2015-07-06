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

/* jshint maxlen: 400 */
'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = [
	{
		_id: new ObjectID('abc000000000000000000001'),
		name: 'NPG Home',
		url: 'nature.com',
		timeout: 30000,
		standard: 'WCAG2AA',
		username: 'user',
		password: 'access',
		ignore: ['foo', 'bar']
	},
	{
		_id: new ObjectID('abc000000000000000000002'),
		name: 'NPG Home',
		url: 'nature.com',
		timeout: 30000,
		standard: 'WCAG2AAA'
	},
	{
		_id: new ObjectID('abc000000000000000000003'),
		name: 'Nature News',
		url: 'nature.com/news',
		timeout: 30000,
		standard: 'Section508'
	}
];
