'use strict';

var Hapi = require('hapi');

var pathValidator = {
	id: Hapi.types.String().alphanum()
};

function notImplemented (req) {
	req.reply().code(501);
}

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
					payload: false,
					path: pathValidator
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
					payload: false,
					path: pathValidator
				}
			}
		},

		// Get results for a task
		{
			method: 'GET',
			path: '/tasks/{id}/results',
			handler: notImplemented,
			config: {
				validate: {
					query: {
						from: Hapi.types.String().date(),
						to: Hapi.types.String().date(),
						full: Hapi.types.Boolean()
					},
					payload: false,
					path: pathValidator
				}
			}
		},

		// Generate results for a task
		// TODO: use 202 status
		{
			method: 'GET',
			path: '/tasks/{id}/run',
			handler: notImplemented,
			config: {
				validate: {
					query: {},
					payload: false,
					path: pathValidator
				}
			}
		}

	];
};
