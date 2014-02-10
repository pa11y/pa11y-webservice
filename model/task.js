// This file is part of pa11y-webservice.
// 
// pa11y-webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// pa11y-webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with pa11y-webservice.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

var async = require('async');
var availablePorts = [12400, 12401, 12402, 12403, 12404, 12405, 12406, 12407, 12408, 12409];
var ObjectID = require('mongodb').ObjectID;
var pa11y = require('pa11y');

// Task model
module.exports = function (app, callback) {
	app.db.collection('tasks', function (err, collection) {
		collection.ensureIndex({name: 1, url: 1, standard: 1}, {w: -1});
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
				collection
					.find()
					.sort({name: 1, standard: 1, url: 1})
					.toArray(function (err, tasks) {
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

			// Edit a task by ID
			editById: function (id, edits, callback) {
				var idString = id;
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null, 0);
				}
				var now = Date.now();
				var taskEdits = {
					name: edits.name
				}
				if (edits.ignore) {
					taskEdits.ignore = edits.ignore;
				}
				collection.update({_id: id}, {$set: taskEdits}, function (err, updateCount) {
					if (err || updateCount < 1) {
						return callback(err, 0);
					}
					var annotation = {
						type: 'edit',
						date: now,
						comment: edits.comment || 'Edited task'
					};
					model.addAnnotationById(idString, annotation, function (err) {
						callback(err, updateCount);
					});
				});
			},

			// Add an annotation to a task
			addAnnotationById: function (id, annotation, callback) {
				model.getById(id, function (err, task) {
					if (err || !task) {
						return callback(err, 0);
					}
					id = new ObjectID(id);
					if (!Array.isArray(task.annotations)) {
						collection.update({_id: id}, {$set: {annotations: [annotation]}}, callback);
					} else {
						collection.update({_id: id}, {$push: {annotations: annotation}}, callback);
					}
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
							results.ignore = task.ignore;
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
				var output =  {
					id: task._id.toString(),
					name: task.name,
					url: task.url,
					standard: task.standard,
					ignore: task.ignore || []
				};
				if (task.annotations) {
					output.annotations = task.annotations;
				}
				return output;
			}

		};
		callback(err, model);
	});
};
