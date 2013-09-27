/* jshint maxlen: 400 */
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
