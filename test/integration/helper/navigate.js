'use strict';

var request = require('request');

module.exports = createNavigator;

// Create a navigate function
function createNavigator (baseUrl, store) {
	return function (opts, callback) {

		store.body = null;
		store.request = null;
		store.response = null;
		store.status = null;

		request({
			url: baseUrl + opts.endpoint,
			method: opts.method || 'GET',
			body: opts.body,
			json: true,
			qs: opts.query
		}, function (err, res, body) {
			store.body = body;
			store.request = res.request;
			store.response = res;
			store.status = res.statusCode;
			callback(err);
		});

	};
}
