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

			// Get all tasks
			getAll: function (callback) {
				collection.find().sort({url: 1, standard: 1}).toArray(function (err, tasks) {
					if (err) {
						return callback(err);
					}
					callback(null, tasks.map(model.prepareForOutput));
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
