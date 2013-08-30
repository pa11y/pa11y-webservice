'use strict';

var Hapi = require('hapi');

// Application routes
module.exports = [
	{
		method: 'GET',
		path: '/',
		handler: function (req) {
			req.reply({});
		},
		config: {
			jsonp: 'callback',
			validate: {
				query: {}
			}
		}
	}
];
