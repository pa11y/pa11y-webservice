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

/* eslint camelcase: 'off' */
'use strict';

const chalk = require('chalk');
const Joi = require('joi');
const validateAction = require('pa11y').validateAction;

// Routes relating to individual tasks
module.exports = function(app) {
	const model = app.model;
	const server = app.server;

	// Get a task
	server.route({
		method: 'GET',
		path: '/tasks/{id}',
		handler: async function(request, reply) {

			const task = await model.task.getById(request.params.id);

			if (!task) {
				return reply.response({
					code: 404,
					error: 'Not Found'
				}).code(404);
			}

			if (request.query.lastres) {
				const results = await model.result.getByTaskId(task.id, {
					limit: 1,
					full: true
				});
				if (!results) {
					return reply.response().code(500);
				}
				task.last_result = null;
				if (results && results.length) {
					task.last_result = results[0];
				}
				return reply.response(task).code(200);
			}

			return reply.response(task).code(200);
		},
		options: {
			validate: {
				query: {
					lastres: Joi.boolean()
				},
				payload: false
			}
		}
	});

	// Edit a task
	server.route({
		method: 'PATCH',
		path: '/tasks/{id}',
		handler: async function(request, reply) {
		  const task = await model.task.getById(request.params.id);

			if (!task) {
				return reply.response({
					code: 404,
					error: 'Not Found'
				}).code(404);
			}

			if (request.payload.actions && request.payload.actions.length) {
				for (let action of request.payload.actions) {
					if (!validateAction(action)) {
						return reply.response({
							statusCode: 400,
							message: 'Invalid action: "' + action + '"'
						}).code(400);
					}
				}
			}
			const updateCount = await model.task.editById(task.id, request.payload);
			if (updateCount < 1) {
				return reply.response().code(500);
			}
			const taskAgain = await model.task.getById(task.id);
			reply.response(taskAgain).code(200);

		},
		options: {
			validate: {
				query: {},
				payload: {
					name: Joi.string().required(),
					timeout: Joi.number().integer(),
					wait: Joi.number().integer(),
					ignore: Joi.array(),
					actions: Joi.array().items(Joi.string()),
					comment: Joi.string(),
					username: Joi.string().allow(''),
					password: Joi.string().allow(''),
					hideElements: Joi.string().allow(''),
					headers: [
						Joi.string().allow(''),
						Joi.object().pattern(/.*/, Joi.string().allow(''))
					]
				}
			}
		}
	});

	// Delete a task
	server.route({
		method: 'DELETE',
		path: '/tasks/{id}',
		handler: async function(request, reply) {
			const task = await model.task.deleteById(request.params.id);
			if (!task) {
				return reply.response({
					code: 404,
					error: 'Not Found'
				}).code(404);
			}

			const removed = await model.result.deleteByTaskId(request.params.id);
			if (!removed) {
				return reply.response().code(500);
			}
			return reply.response().code(204);
		},
		options: {
			validate: {
				query: {},
				payload: false
			}
		}
	});

	// Run a task
	server.route({
		method: 'POST',
		path: '/tasks/{id}/run',
		handler: async function(request, reply) {
			const task = await model.task.getById(request.params.id);
			if (!task) {
				return reply.response({
					code: 404,
					error: 'Not Found'
				}).code(404);
			}
			if (process.env.NODE_ENV !== 'test') {
				console.log('');
				console.log(chalk.grey('Starting to run one-off task @ %s'), new Date());
				console.log('Starting task %s', task.id);
				const executed = await model.task.runById(request.params.id);
				if (!executed) {
					console.log(
						chalk.red('Failed to finish task %s: %s'),
						task.id,
						error.message
					);
				} else {
					console.log(chalk.green('Finished task %s'), task.id);
				}
				console.log(
					chalk.grey('Finished running one-off task @ %s'),
					new Date()
				);
			}
			return reply.response().code(202);
		},
		options: {
			validate: {
				query: {}
			}
		}
	});

	// Get results for a task
	server.route({
		method: 'GET',
		path: '/tasks/{id}/results',
		handler: async function(request, reply) {
			const task = await model.task.getById(request.params.id);
			if (!task) {
				return reply.response({
					code: 404,
					error: 'Not Found'
				}).code(404);
			}

			const results = await model.result.getByTaskId(request.params.id, request.query);
			if (!results) {
				return reply.response().code(500);
			}
			return reply.response(results).code(200);
		},
		options: {
			validate: {
				query: {
					from: Joi.string().isoDate(),
					to: Joi.string().isoDate(),
					full: Joi.boolean()
				},
				payload: false
			}
		}
	});

	// Get a result for a task
	server.route({
		method: 'GET',
		path: '/tasks/{tid}/results/{rid}',
		handler: async function(request, reply) {
			const rid = request.params.rid;
			const tid = request.params.tid;
			const result = await model.result.getByIdAndTaskId(rid, tid, request.query);

			if (!result) {
				return reply.response({
					code: 404,
					error: 'Not Found'
				}).code(404);
			}
			return reply.response(result).code(200);
		},
		options: {
			validate: {
				query: {
					full: Joi.boolean()
				},
				payload: false
			}
		}
	});

};
