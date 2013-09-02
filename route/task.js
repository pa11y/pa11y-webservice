'use strict';

var Hapi = require('hapi');

var pathValidator = {
	id: Hapi.types.String().alphanum()
};

function notImplemented (req) {
	req.reply().code(501);
}

// Routes relating to individual tasks
module.exports = function () {
	return [

		// Get a task
		{
			method: 'GET',
			path: '/tasks/{id}',
			handler: notImplemented,
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
			handler: notImplemented,
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
