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

var ObjectID = require('mongodb').ObjectID;

// Result model
module.exports = function(app, callback) {
	app.db.collection('results', function(error, collection) {
		collection.ensureIndex({
			date: 1
		}, {
			w: -1
		});
		var model = {

			collection: collection,

			// Create a result
			create: function(newResult, callback) {
				if (!newResult.date) {
					newResult.date = Date.now();
				}
				if (newResult.task && !(newResult.task instanceof ObjectID)) {
					newResult.task = new ObjectID(newResult.task);
				}
				collection.insert(newResult, function(error, result) {
					if (error) {
						return callback(error);
					}
					callback(null, model.prepareForOutput(result.ops[0]));
				});
			},

			// Default filter options
			_defaultFilterOpts: function(opts) {
				var now = Date.now();
				var thirtyDaysAgo = now - (1000 * 60 * 60 * 24 * 30);
				return {
					from: (new Date(opts.from || thirtyDaysAgo)).getTime(),
					to: (new Date(opts.to || now)).getTime(),
					full: Boolean(opts.full),
					task: opts.task
				};
			},

			// Get results
			_getFiltered: function(opts, callback) {
				opts = model._defaultFilterOpts(opts);
				var filter = {
					date: {
						$lt: opts.to,
						$gt: opts.from
					}
				};
				if (opts.task) {
					filter.task = new ObjectID(opts.task);
				}
				collection
					.find(filter)
					.sort({date: -1})
					.limit(opts.limit || 0)
					.toArray(function(error, results) {
						if (error) {
							return callback(error);
						}
						callback(null, results.map(opts.full ? model.prepareForFullOutput : model.prepareForOutput));
					});
			},

			// Get results for all tasks
			getAll: function(opts, callback) {
				delete opts.task;
				model._getFiltered(opts, callback);
			},

			// Get a result by ID
			getById: function(id, full, callback) {
				var prepare = (full ? model.prepareForFullOutput : model.prepareForOutput);
				try {
					id = new ObjectID(id);
				} catch (error) {
					return callback(null, null);
				}
				collection.findOne({_id: id}, function(error, result) {
					if (error) {
						return callback(error);
					}
					if (result) {
						result = prepare(result);
					}
					callback(null, result);
				});
			},

			// Get results for a single task
			getByTaskId: function(id, opts, callback) {
				opts.task = id;
				model._getFiltered(opts, callback);
			},

			// Delete results for a single task
			deleteByTaskId: function(id, callback) {
				try {
					id = new ObjectID(id);
				} catch (error) {
					return callback(null);
				}
				collection.deleteMany({task: id}, callback);
			},

			// Get a result by ID and task ID
			getByIdAndTaskId: function(id, task, opts, callback) {
				var prepare = (opts.full ? model.prepareForFullOutput : model.prepareForOutput);
				try {
					id = new ObjectID(id);
					task = new ObjectID(task);
				} catch (error) {
					return callback(null, null);
				}
				collection.findOne({
					_id: id,
					task: task
				}, function(error, result) {
					if (error) {
						return callback(error);
					}
					if (result) {
						result = prepare(result);
					}
					callback(null, result);
				});
			},

			// Prepare a result for output
			prepareForOutput: function(result) {
				result = model.prepareForFullOutput(result);
				delete result.results;
				return result;
			},
			prepareForFullOutput: function(result) {
				return {
					id: result._id.toString(),
					task: result.task.toString(),
					date: new Date(result.date).toISOString(),
					count: result.count,
					ignore: result.ignore || [],
					results: result.results || []
				};
			},
			convertPa11y2Results: function(results) {
				var resultObject = {
					count: {
						total: results.length,
						error: results.filter(function(result) {
							return (result.type === 'error');
						}).length,
						warning: results.filter(function(result) {
							return (result.type === 'warning');
						}).length,
						notice: results.filter(function(result) {
							return (result.type === 'notice');
						}).length
					},
					results: results
				};
				return resultObject;
			}

		};
		callback(error, model);
	});
};
