'use strict';

module.exports = clearDatabase;

// Clear data from the database
function clearDatabase (app, done) {
	app.db.collection('results').remove(function (err) {
		if (err) {
			done(err);
		}
		app.db.collection('tasks').remove(function (err) {
			done(err);
		});
	});
}
