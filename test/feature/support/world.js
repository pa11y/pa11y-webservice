'use strict';

var config = require('../../../config/test.json');
var request = require('request');

var cachedApp = null;
var baseUrl = 'http://localhost:' + config.port + '/';

exports.World = World;

// World constructor
function World (callback) {
	this.app = null;
	this.response = null;
	this.status = null;
	this.body = null;
	this.request = null;

	if (cachedApp) {
		this.app = cachedApp;
		callback();
	} else {
		var that = this;
		request(baseUrl, function (err) {
			if (err) {
				console.error('Error: Test app not started; run with `make start-test`');
				process.exit();
			}
			config.dbOnly = true;
			require('../../../app')(config, function (err, app) {
				cachedApp = that.app = app;
				that.clearDb(callback);
			});
		});
	}
}

// Clear data from the database
World.prototype.clearDb = function (callback) {
	var that = this;
	this.app.db.collection('results').remove(function (err) {
		if (err) {
			callback(err);
		}
		that.app.db.collection('tasks').remove(function (err) {
			callback(err);
		});
	});
};

// Navigate to an endpoint
World.prototype.navigate = function (endpoint, opts, callback) {
	var that = this;
	this.response = null;
	this.status = null;
	this.body = null;
	this.request = {
		url: baseUrl + endpoint,
		method: opts.method || 'GET',
		body: opts.body,
		json: true,
		qs: opts.query
	};
	request(this.request, function (err, res, body) {
		that.response = res;
		that.status = res.statusCode;
		that.body = body;
		callback(err);
	});
};
