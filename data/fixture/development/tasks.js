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
		_id: new ObjectID('52382f4ac0d6c9ac49000006'),
		ignore: [],
		name: 'BBC World News',
		standard: 'Section508',
		url: 'http://www.bbc.co.uk/news/world/'
	},
	{
		_id: new ObjectID('52382ec8c0d6c9ac49000001'),
		ignore: [],
		name: 'NPG Home',
		standard: 'WCAG2AA',
		url: 'http://www.nature.com/'
	},
	{
		_id: new ObjectID('52382ef5c0d6c9ac49000002'),
		ignore: [],
		name: 'NPG Home',
		standard: 'WCAG2AAA',
		url: 'http://www.nature.com/'
	},
	{
		_id: new ObjectID('52382f31c0d6c9ac49000005'),
		ignore: [],
		name: 'GitHub Home',
		standard: 'WCAG2A',
		url: 'https://github.com/'
	},
	{
		_id: new ObjectID('52382f23c0d6c9ac49000004'),
		ignore: [],
		name: 'Nature On GitHub',
		standard: 'WCAG2A',
		url: 'https://github.com/nature'
	},
	{
		_id: new ObjectID('52382f08c0d6c9ac49000003'),
		ignore: [],
		name: 'GOV.UK Home',
		standard: 'WCAG2AA',
		url: 'https://www.gov.uk/'
	},
	{
		_id: new ObjectID('52457e2b135a4b51b4000001'),
		ignore: [
			'WCAG2AA.Principle3.Guideline3_2.3_2_1.G107',
			'WCAG2AA.Principle2.Guideline2_4.2_4_4.H77,H78,H79,H80,H81',
			'WCAG2AA.Principle2.Guideline2_4.2_4_4.H77,H78,H79,H80,H81,H33',
			'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage'
		],
		name: 'Twitter Home',
		standard: 'WCAG2AA',
		url: 'https://twitter.com/'
	},
	{
		_id: new ObjectID('52458167acc00c15b8000001'),
		ignore: [],
		name: 'pa11y',
		standard: 'WCAG2AA',
		url: 'http://pa11y.org'
	}
];
