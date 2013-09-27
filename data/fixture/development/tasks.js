/* jshint maxlen: 400 */
'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = [
	{
		_id: new ObjectID('52382f4ac0d6c9ac49000006'),
		ignore: [],
		standard: 'Section508',
		url: 'http://www.bbc.co.uk/news/world/'
	},
	{
		_id: new ObjectID('52382ec8c0d6c9ac49000001'),
		ignore: [],
		standard: 'WCAG2AA',
		url: 'http://www.nature.com/'
	},
	{
		_id: new ObjectID('52382ef5c0d6c9ac49000002'),
		ignore: [],
		standard: 'WCAG2AAA',
		url: 'http://www.nature.com/'
	},
	{
		_id: new ObjectID('52382f31c0d6c9ac49000005'),
		ignore: [],
		standard: 'WCAG2A',
		url: 'https://github.com/'
	},
	{
		_id: new ObjectID('52382f23c0d6c9ac49000004'),
		ignore: [],
		standard: 'WCAG2A',
		url: 'https://github.com/nature'
	},
	{
		_id: new ObjectID('52382f08c0d6c9ac49000003'),
		ignore: [],
		standard: 'WCAG2AA',
		url: 'https://www.gov.uk/'
	}
];
