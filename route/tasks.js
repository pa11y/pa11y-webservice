'use strict';

var Hapi = require('hapi');

function notImplemented (req) {
	req.reply().code(501);
}

// Routes relating to all tasks
module.exports = [

	// Get all tasks
	{
		method: 'GET',
		path: '/tasks',
		handler: notImplemented,
		config: {
			validate: {
				query: {},
				payload: false
			}
		}
	},

	// Create a task
	// TODO: return 201 status on success
	{
		method: 'POST',
		path: '/tasks',
		handler: notImplemented,
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
		handler: notImplemented,
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
	},

	// Generate new results for all tasks
	// TODO: return 202 status
	{
		method: 'GET',
		path: '/tasks/run',
		handler: notImplemented,
		config: {
			validate: {
				query: {},
				payload: false
			}
		}
	}

];
