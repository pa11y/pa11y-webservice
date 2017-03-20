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

var day = (1000 * 60 * 60 * 24);
var ObjectID = require('mongodb').ObjectID;

module.exports = [
	{
		_id: new ObjectID('def000000000000000000001'),
		task: new ObjectID('abc000000000000000000001'),
		date: Date.now(),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000002'),
		task: new ObjectID('abc000000000000000000002'),
		date: Date.now() - (day * 4),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000003'),
		task: new ObjectID('abc000000000000000000001'),
		date: Date.now() - (day * 7),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000004'),
		task: new ObjectID('abc000000000000000000002'),
		date: Date.now() - (day * 28),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000005'),
		task: new ObjectID('abc000000000000000000002'),
		date: (new Date('2013-01-01')).getTime(),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000006'),
		task: new ObjectID('abc000000000000000000002'),
		date: (new Date('2013-01-05')).getTime(),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000007'),
		task: new ObjectID('abc000000000000000000001'),
		date: (new Date('2013-01-06')).getTime(),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	},
	{
		_id: new ObjectID('def000000000000000000008'),
		task: new ObjectID('abc000000000000000000002'),
		date: (new Date('2013-01-08')).getTime(),
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	}
];
