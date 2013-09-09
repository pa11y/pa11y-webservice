'use strict';

var Hapi = require('hapi');

// Routes relating to all tasks
module.exports = function (model) {
	return [

		// Get all tasks
		{
			method: 'GET',
			path: '/tasks',
			handler: function (req) {
				model.task.getAll(function (err, tasks) {
					if (err || !tasks) {
						return req.reply().code(500);
					}
					req.reply(tasks).code(200);
				});
			},
			config: {
				validate: {
					query: {},
					payload: false
				}
			}
		},

		// Create a task
		{
			method: 'POST',
			path: '/tasks',
			handler: function (req) {
				model.task.create(req.payload, function (err, task) {
					if (err || !task) {
						return req.reply().code(500);
					}
					req
						.reply(task)
						.header('Location', 'http://' + req.info.host + '/tasks/' + task.id)
						.code(201);
				});
			},
			config: {
				validate: {
					query: {},
					payload: {
						url: Hapi.types.String().required(),
						standard: Hapi.types.String().required().valid([
							'Section508', 'WCAG2A', 'WCAG2AA', 'WCAG2AAA'
						]),
						ignore: Hapi.types.Array()
					}
				}
			}
		},

		// Get results for all tasks
		{
			method: 'GET',
			path: '/tasks/results',
			handler: function (req) {
				model.result.getAll(req.query, function (err, results) {
					if (err || !results) {
						return req.reply().code(500);
					}
					req.reply(results).code(200);
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
