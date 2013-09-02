'use strict';

// Hooks
module.exports = function () {

	// Before each scenario
	this.Before(function (callback) {
		// TODO any setup required
		callback();
	});

	// After each scenario
	this.After(function (callback) {
		// TODO clear database
		callback();
	});

};
