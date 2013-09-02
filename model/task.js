'use strict';

// Task model
module.exports = function (db, callback) {
	db.collection('tasks', function (err, collection) {
		var model = {

			collection: collection,

			// Create a task
			create: function (newTask, callback) {
				collection.insert(newTask, function (err, task) {
					if (err) {
						return callback(err);
					}
					callback(null, model.prepareForOutput(task[0]));
				});
			},

			// Prepare a task for output
			prepareForOutput: function (task) {
				return {
					id: task._id,
					url: task.url,
					standard: task.standard,
					ignore: task.ignore || []
				};
			}

		};
		callback(err, model);
	});
};
