'use strict';

var ObjectID = require('mongodb').ObjectID;

// Result model
module.exports = function (app, callback) {
	app.db.collection('results', function (err, collection) {
		var model = {

			collection: collection,

			// Create a result
			create: function (newResult, callback) {
				if (!newResult.date) {
					newResult.date = Date.now();
				}
				if (newResult.task && !(newResult.task instanceof ObjectID)) {
					newResult.task = new ObjectID(newResult.task);
				}
				collection.insert(newResult, function (err, result) {
					if (err) {
						return callback(err);
					}
					callback(null, model.prepareForOutput(result[0]));
				});
			},

			// Default filter options
			_defaultFilterOpts: function (opts) {
				var now = Date.now();
				var thirtyDaysAgo = now - (1000 * 60 * 60 * 24 * 30);
				return {
					from: (new Date(opts.from || thirtyDaysAgo)).getTime(),
					to: (new Date(opts.to || now)).getTime(),
					full: !!opts.full,
					task: opts.task
				};
			},

			// Get results
			_getFiltered: function (opts, callback) {
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
					.toArray(function (err, results) {
						if (err) {
							return callback(err);
						}
						callback(null, results.map(opts.full ? model.prepareForFullOutput : model.prepareForOutput));
					});
			},

			// Get results for all tasks
			getAll: function (opts, callback) {
				delete opts.task;
				model._getFiltered(opts, callback);
			},

			// Get a result by ID
			getById: function (id, full, callback) {
				var prepare = (full ? model.prepareForFullOutput : model.prepareForOutput);
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null, null);
				}
				collection.findOne({_id: id}, function (err, result) {
					if (err) {
						return callback(err);
					}
					if (result) {
						result = prepare(result);
					}
					callback(null, result);
				});
			},

			// Get results for a single task
			getByTaskId: function (id, opts, callback) {
				opts.task = id;
				model._getFiltered(opts, callback);
			},

			// Delete results for a single task
			deleteByTaskId: function (id, callback) {
				try {
					id = new ObjectID(id);
				} catch (err) {
					return callback(null);
				}
				collection.remove({task: id}, callback);
			},

			// Get a result by ID and task ID
			getByIdAndTaskId: function (id, task, opts, callback) {
				var prepare = (opts.full ? model.prepareForFullOutput : model.prepareForOutput);
				try {
					id = new ObjectID(id);
					task = new ObjectID(task);
				} catch (err) {
					return callback(null, null);
				}
				collection.findOne({_id: id, task: task}, function (err, result) {
					if (err) {
						return callback(err);
					}
					if (result) {
						result = prepare(result);
					}
					callback(null, result);
				});
			},

			// Prepare a result for output
			prepareForOutput: function (result) {
				result = model.prepareForFullOutput(result);
				delete result.results;
				return result;
			},
			prepareForFullOutput: function (result) {
				return {
					id: result._id.toString(),
					task: result.task.toString(),
					date: new Date(result.date).toISOString(),
					count: result.count,
					results: result.results || []
				};
			}

		};
		callback(err, model);
	});
};
