'use strict';

var async = require('async');
var availablePorts = [12400, 12401, 12402, 12403, 12404, 12405, 12406, 12407, 12408, 12409];
var ObjectID = require('mongodb').ObjectID;
var pa11y = require('pa11y');

// Task model
module.exports = function (app, callback) {
	app.db.collection('tasks', function (err, collection) {
		collection.ensureIndex({url: 1, standard: 1}, {w: -1});
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

			// Run a task by ID
			runById: function (id, callback) {
				model.getById(id, function (err, task) {
					if (err) {
						return callback(err);
					}
					var port = availablePorts.shift();
					async.waterfall([

						function (next) {
							pa11y.sniff({
								url: task.url,
								standard: task.standard,
								config: {
									ignore: task.ignore
								},
								port: port
							}, next);
						},

						function (results, next) {
							results.task = new ObjectID(task.id);
							app.model.result.create(results, next);
						}

					], function (err, result) {
						availablePorts.push(port);
						callback(err, result);
					});
				});
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
