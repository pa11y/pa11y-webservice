'use strict';

var config = require('../../../config/test.json');
var request = require('request');

var baseUrl = 'http://localhost:' + config.port + '/';

// World constructor
function World (callback) {
	this.status = null;
	this.body = null;
	request(baseUrl, function (err) {
		if (err) {
			console.error('Error: Test app not started; run with `make start-test`');
			process.exit();
		}
		callback();
	});
}

// Navigate to an endpoint
World.prototype.navigate = function (endpoint, opts, callback) {
	var that = this;
	this.status = null;
	this.body = null;
	request({
		url: baseUrl + endpoint,
		method: opts.method || 'GET',
		body: opts.body,
		json: true,
		qs: opts.query
	}, function (err, res, body) {
		that.status = res.statusCode;
		that.body = body;
		callback();
	});
};

// Exports
exports.World = World;
