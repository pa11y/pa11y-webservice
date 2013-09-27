/* jshint maxlen: 400 */
'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = [
	{
		_id: new ObjectID('abc000000000000000000001'),
		url: 'nature.com',
		standard: 'WCAG2AA',
		ignore: ['foo', 'bar']
	},
	{
		_id: new ObjectID('abc000000000000000000002'),
		url: 'nature.com',
		standard: 'WCAG2AAA'
	},
	{
		_id: new ObjectID('abc000000000000000000003'),
		url: 'nature.com/news',
		standard: 'Section508'
	}
];
