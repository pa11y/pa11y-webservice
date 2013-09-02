'use strict';

// Hooks
module.exports = function () {

	// After each scenario
	this.After(function (callback) {
		this.clearDb(callback);
	});

};
