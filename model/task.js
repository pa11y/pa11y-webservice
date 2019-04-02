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

const chalk = require('chalk');
const ObjectID = require('mongodb').ObjectID;
const pa11y = require('pa11y');

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
		const model = {

			collection: collection,

			// Create a task
			create: function(newTask) {
				newTask.headers = model.sanitizeHeaderInput(newTask.headers);

				return collection.insert(newTask)
					.then(result => {
						return model.prepareForOutput(result.ops[0]);
					})
					.catch((error) => {
						console.error('create failed');
					});
			},

			// Get all tasks
			getAll: function() {
				return collection
					.find()
					.sort({
						name: 1,
						standard: 1,
						url: 1
					})
					.toArray()
					.then(tasks => {
						return tasks.map(model.prepareForOutput);
					})
					.catch((error) => {
						console.error('getAll failed');
					});
			},

			// Get a task by ID
			getById: function(id) {
				try {
					id = new ObjectID(id);
				} catch (error) {
					return Promise.reject(new Error('Getting ID from MongoDB failed'));
				}

				return collection.findOne({_id: id})
					.then(task => {
						return model.prepareForOutput(task);
					})
					.catch((error) => {
						console.error('getById failed');
					});
			},

			// Edit a task by ID
			editById: function(id, edits) {
				const idString = id;
				try {
					id = new ObjectID(id);
				} catch (error) {
					return Promise.reject(new Error('Getting ID from MongoDB failed'));
				}
				const now = Date.now();
				const taskEdits = {
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

				return collection.update({_id: id}, {$set: taskEdits})
					.then(updateCount => {
						if (updateCount < 1) {
							return 0;
						}
						const annotation = {
							type: 'edit',
							date: now,
							comment: edits.comment || 'Edited task'
						};
						return model.addAnnotationById(idString, annotation)
							.then(() => {
								return updateCount;
							});
					})
					.catch((error) => {
						console.error('editById failed');
					});
			},

			// Add an annotation to a task
			addAnnotationById: function(id, annotation) {
				return model.getById(id)
					.then(task => {
						if (!task) {
							return 0;
						}
						id = new ObjectID(id);
						if (Array.isArray(task.annotations)) {
							return collection.update({_id: id}, {$push: {annotations: annotation}});
						}
						return collection.update({_id: id}, {$set: {annotations: [annotation]}});

					})
					.catch((error) => {
						console.error('addAnnotationById failed');
					});
			},

			// Delete a task by ID
			deleteById: function(id) {
				try {
					id = new ObjectID(id);
				} catch (error) {
					return Promise.reject(new Error('Getting ID from MongoDB failed'));
				}
				return collection.deleteOne({_id: id})
					.then(result => {
						return result ? result.deletedCount : null;
					})
					.catch((error) => {
						console.error('deleteById failed');
					});
			},

			// Run a task by ID
			runById: function(id) {
				let options;

				return model.getById(id)
					.then(task => {
						options = task;

						const pa11yOptions = {
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

						const test = pa11y(pa11yOptions);
						return test.run(task.url);

					})
					.then(results => {
						results = app.model.result.convertPa11y2Results(results);
						results.task = new ObjectID(options.id);
						results.ignore = options.ignore;
						return app.model.result.create(results);
					})
					.catch((error) => {
						console.error('runById failed');
					});

			},

			// Prepare a task for output
			prepareForOutput: function(task) {
				const output = {
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
