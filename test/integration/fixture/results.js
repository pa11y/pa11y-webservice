'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = [

	{
		_id: new ObjectID('def000000000000000000001'),
		task: new ObjectID('abc000000000000000000001'),
		date: Date.now(), // Now
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
		date: Date.now() - (1000 * 60 * 60 * 24 * 4), // 4 days ago
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
		date: Date.now() - (1000 * 60 * 60 * 24 * 7), // 7 days ago
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
		date: Date.now() - (1000 * 60 * 60 * 24 * 28), // 28 days ago
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
		date: (new Date('2013-01-01')).getTime(), // 1st Jan 2013
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
		date: (new Date('2013-01-05')).getTime(), // 5th Jan 2013
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
		date: (new Date('2013-01-06')).getTime(), // 6th Jan 2013
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
		date: (new Date('2013-01-08')).getTime(), // 8th Jan 2013
		count: {
			error: 1,
			warning: 2,
			notice: 3,
			total: 6
		},
		results: ['foo', 'bar']
	}

];
