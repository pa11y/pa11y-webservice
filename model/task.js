// This file is part of Pa11y Webservice.
//
// Pa11y Webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Pa11y Webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Pa11y Webservice.  If not, see <http://www.gnu.org/licenses/>.

/* eslint id-length: 'off' */
/* eslint no-catch-shadow: 'off' */
/* eslint no-underscore-dangle: 'off' */
'use strict';

var async = require('async');
var chalk = require('chalk');
var ObjectID = require('mongodb').ObjectID;
var pa11y = require('pa11y');

function pa11yLog(message) {
	console.log(chalk.grey('  > ' + message));
}

// Task model
module.exports = function(app, callback) {
	app.db.collection('tasks', function(error, collection) {
		collection.ensureIndex({
			name: 1,
			url: 1,
			standard: 1
		}, {
			w: -1
		});
		var model = {

			collection: collection,

			// Create a task
			create: function(newTask, callback) {
				newTask.headers = model.sanitizeHeaderInput(newTask.headers);
				collection.insert(newTask, function(error, result) {
					if (error) {
						return callback(error);
					}
					callback(null, model.prepareForOutput(result.ops[0]));
				});
			},

			// Get all tasks
			getAll: function(callback) {
				collection
					.find()
					.sort({
						name: 1,
						standard: 1,
						url: 1
					})
					.toArray(function(error, tasks) {
						if (error) {
							return callback(error);
						}
						callback(null, tasks.map(model.prepareForOutput));
					});
			},

			// Get a task by ID
			getById: function(id, callback) {
				try {
					id = new ObjectID(id);
				} catch (error) {
					return callback(null, null);
				}
				collection.findOne({_id: id}, function(error, task) {
					if (error) {
						return callback(error);
					}
					if (task) {
						task = model.prepareForOutput(task);
					}
					callback(null, task);
				});
			},

			// Edit a task by ID
			editById: function(id, edits, callback) {
				var idString = id;
				try {
					id = new ObjectID(id);
				} catch (error) {
					return callback(null, 0);
				}
				var now = Date.now();
				var taskEdits = {
					name: edits.name,
					timeout: parseInt(edits.timeout, 10),
					wait: parseInt(edits.wait, 10),
					actions: edits.actions,
					username: edits.username,
					password: edits.password
				};
				if (edits.ignore) {
					taskEdits.ignore = edits.ignore;
				}
				if (edits.hideElements) {
					taskEdits.hideElements = edits.hideElements;
				}
				if (edits.headers) {
					taskEdits.headers = model.sanitizeHeaderInput(edits.headers);
				}
				collection.update({_id: id}, {$set: taskEdits}, function(error, updateCount) {
					if (error || updateCount < 1) {
						return callback(error, 0);
					}
					var annotation = {
						type: 'edit',
						date: now,
						comment: edits.comment || 'Edited task'
					};
					model.addAnnotationById(idString, annotation, function(error) {
						callback(error, updateCount);
					});
				});
			},

			// Add an annotation to a task
			addAnnotationById: function(id, annotation, callback) {
				model.getById(id, function(error, task) {
					if (error || !task) {
						return callback(error, 0);
					}
					id = new ObjectID(id);
					if (Array.isArray(task.annotations)) {
						collection.update({_id: id}, {$push: {annotations: annotation}}, callback);
					} else {
						collection.update({_id: id}, {$set: {annotations: [annotation]}}, callback);
					}
				});
			},

			// Delete a task by ID
			deleteById: function(id, callback) {
				try {
					id = new ObjectID(id);
				} catch (error) {
					return callback(null);
				}
				collection.deleteOne({_id: id}, function(error, result) {
					callback(error, result ? result.deletedCount : null);
				});
			},

			// Run a task by ID
			runById: function(id, callback) {
				model.getById(id, function(error, task) {
					if (error) {
						return callback(error);
					}
					var pa11yOptions = {
						standard: task.standard,
						timeout: (task.timeout || 30000),
						wait: (task.wait || 0),
						ignore: task.ignore,
						actions: task.actions || [],
						phantom: {},
						log: {
							debug: pa11yLog,
							error: pa11yLog,
							log: pa11yLog
						}
					};
					if (task.username && task.password) {
						pa11yOptions.page = {
							settings: {
								userName: task.username,
								password: task.password
							}
						};
					}
					if (task.headers && typeof task.headers === 'object') {
						if (pa11yOptions.page) {
							pa11yOptions.page.headers = task.headers;
						} else {
							pa11yOptions.page = {
								headers: task.headers
							};
						}
					}
					if (task.hideElements) {
						pa11yOptions.hideElements = task.hideElements;
					}

					async.waterfall([

						function(next) {
							try {
								var test = pa11y(pa11yOptions);
								test.run(task.url, next);
							} catch (error) {
								return next(error);
							}
						},

						function(results, next) {
							results = app.model.result.convertPa11y2Results(results);
							results.task = new ObjectID(task.id);
							results.ignore = task.ignore;
							app.model.result.create(results, next);
						}

					], callback);
				});
			},

			// Prepare a task for output
			prepareForOutput: function(task) {
				var output = {
					id: task._id.toString(),
					name: task.name,
					url: task.url,
					timeout: (task.timeout ? parseInt(task.timeout, 10) : 30000),
					wait: (task.wait ? parseInt(task.wait, 10) : 0),
					standard: task.standard,
					ignore: task.ignore || [],
					actions: task.actions || []
				};
				if (task.annotations) {
					output.annotations = task.annotations;
				}
				if (task.username) {
					output.username = task.username;
				}
				if (task.password) {
					output.password = task.password;
				}
				if (task.hideElements) {
					output.hideElements = task.hideElements;
				}
				if (task.headers) {
					if (typeof task.headers === 'string') {
						try {
							output.headers = JSON.parse(task.headers);
						} catch (error) {}
					} else {
						output.headers = task.headers;
					}
				}
				return output;
			},

			sanitizeHeaderInput: function(headers) {
				if (typeof headers === 'string') {
					try {
						return JSON.parse(headers);
					} catch (error) {
						console.error('Header input contains invalid JSON:', headers);
						return undefined;
					}
				}
				return headers;
			}

		};
		callback(error, model);
	});
};
