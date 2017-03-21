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
