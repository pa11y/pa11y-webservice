'use strict';

var Hapi = require('hapi');

// Routes relating to individual tasks
module.exports = function (model) {
	return [

		// Get a task
		{
			method: 'GET',
			path: '/tasks/{id}',
			handler: function (req) {
				model.task.getById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					req.reply(task).code(200);
				});
			},
			config: {
				validate: {
					query: {},
					payload: false
				}
			}
		},

		// Delete a task
		{
			method: 'DELETE',
			path: '/tasks/{id}',
			handler: function (req) {
				model.task.deleteById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					req.reply().code(204);
				});
			},
			config: {
				validate: {
					query: {},
					payload: false
				}
			}
		},

		// Get results for a task
		{
			method: 'GET',
			path: '/tasks/{id}/results',
			handler: function (req) {
				model.task.getById(req.params.id, function (err, task) {
					if (err) {
						return req.reply().code(500);
					}
					if (!task) {
						return req.reply({
							code: 404,
							error: 'Not Found'
						}).code(404);
					}
					model.result.getByTaskId(req.params.id, req.query, function (err, results) {
						if (err || !results) {
							return req.reply().code(500);
						}
						req.reply(results).code(200);
					});
				});
			},
			config: {
				validate: {
					query: {
						from: Hapi.types.String().date(),
						to: Hapi.types.String().date(),
						full: Hapi.types.Boolean()
					},
					payload: false
				}
			}
		}

	];
};
