'use strict';

var ObjectID = require('mongodb').ObjectID;

// Result model
module.exports = function (db, callback) {
	db.collection('results', function (err, collection) {
		var model = {

			collection: collection,

			// Create a result
			create: function (newResult, callback) {
				if (!newResult.date) {
					newResult.date = Date.now();
				}
				if (newResult.task) {
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

			// Get results for a single task
			getByTaskId: function (id, opts, callback) {
				opts.task = id;
				model._getFiltered(opts, callback);
			},

			// Prepare a result for output
			prepareForOutput: function (result) {
				result = model.prepareForFullOutput(result);
				delete result.results;
				return result;
			},
			prepareForFullOutput: function (result) {
				return {
					id: result._id,
					task: result.task,
					date: result.date,
					count: result.count,
					results: result.results || []
				};
			}

		};
		callback(err, model);
	});
};
