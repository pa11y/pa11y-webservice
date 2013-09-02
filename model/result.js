'use strict';

// Result model
module.exports = function (db, callback) {
	db.collection('results', function (err, collection) {
		callback(err, {

			collection: collection

		});
	});
};
