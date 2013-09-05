'use strict';

var ObjectID = require('mongodb').ObjectID;

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

			// Get a task by ID
			getById: function (id, callback) {
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null, null);
				}
				collection.findOne({_id: id}, function (err, task) {
					if (err) {
						return callback(err);
					}
					if (task) {
						task = model.prepareForOutput(task);
					}
					callback(null, task);
				});
			},

			// Delete a task by ID
			deleteById: function (id, callback) {
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null);
				}
				collection.remove({_id: id}, callback);
			},

			// Prepare a task for output
			prepareForOutput: function (task) {
				return {
					id: task._id.toString(),
					url: task.url,
					standard: task.standard,
					ignore: task.ignore || []
				};
			}

		};
		callback(err, model);
	});
};
