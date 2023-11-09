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
'use strict';

const {green, grey, red} = require('kleur');
const Joi = require('joi');
const {isValidAction} = require('pa11y');

module.exports = function(app) {
	const {model, server} = app;

	server.route({
		path: '/tasks/{taskId}',
		method: 'GET',

		handler: async ({params, query}, reply) => {
			const task = await model.task.getById(params.taskId);

			if (!task) {
				return reply.response('Not Found').code(404);
			}

			if (query.lastres) {
				const results = await model.result.getByTaskId(task.id, {
					limit: 1,
					full: true
				});
				if (!results) {
					return reply.response().code(500);
				}
				/* eslint-disable-next-line camelcase */
				task.last_result = results.length ? results[0] : null;
			}

			return reply.response(task).code(200);
		},
		options: {
			validate: {
				query: Joi.object({
					lastres: Joi.boolean()
				}),
				payload: false
			}
		}
	});

	server.route({
		path: '/tasks/{taskId}',
		method: 'PATCH',

		handler: async ({params, payload}, reply) => {
			const task = await model.task.getById(params.taskId);

			if (!task) {
				return reply.response('Not Found').code(404);
			}

			const invalidAction = payload.actions?.find(action => !isValidAction(action));
			if (invalidAction) {
				return reply.response(`Invalid action: "${invalidAction}"`).code(400);
			}

			const updateCount = await model.task.editById(task.id, payload);
			if (updateCount < 1) {
				return reply.response().code(500);
			}
			const taskAgain = await model.task.getById(task.id);
			return reply.response(taskAgain).code(200);
		},
		options: {
			validate: {
				query: Joi.object({}),
				payload: Joi.object({
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
				})
			}
		}
	});

	server.route({
		path: '/tasks/{taskId}',
		method: 'DELETE',

		handler: async ({params}, reply) => {
			const {taskId} = params;
			const task = await model.task.deleteById(taskId);
			if (!task) {
				return reply.response('Not Found').code(404);
			}

			const removed = await model.result.deleteByTaskId(taskId);
			if (!removed) {
				return reply.response().code(500);
			}
			return reply.response().code(204);
		},
		options: {
			validate: {
				query: Joi.object({}),
				payload: false
			}
		}
	});

	server.route({
		path: '/tasks/{taskId}/run',
		method: 'POST',

		handler: async ({params}, reply) => {
			const {taskId} = params;
			const task = await model.task.getById(taskId);

			if (!task) {
				return reply.response('Not Found').code(404);
			}

			console.log(grey('Starting NEW to run one-off task @ %s'), new Date());
			const executed = await model.task.runById(taskId);

			if (executed) {
				console.log(green('Finished NEW task %s'), task.id);
			} else {
				console.log(
					red('Failed to finish task %s'),
					task.id
				);
				return reply.response(`Failed to finish task ${task.id}`).code(500);
			}
			console.log(
				grey('Finished running one-off task @ %s'),
				new Date()
			);
			return reply.response().code(202);
		},
		options: {
			validate: {
				query: Joi.object({})
			}
		}
	});

	server.route({
		path: '/tasks/{taskId}/results',
		method: 'GET',

		handler: async ({params, query}, reply) => {
			const {taskId} = params;
			const task = await model.task.getById(taskId);
			if (!task) {
				return reply.response('Not Found').code(404);
			}

			const results = await model.result.getByTaskId(taskId, query);
			if (!results) {
				return reply.response('No results found for task').code(500);
			}
			return reply.response(results).code(200);
		},
		options: {
			validate: {
				query: Joi.object({
					from: Joi.string().isoDate(),
					to: Joi.string().isoDate(),
					full: Joi.boolean()
				}),
				payload: false
			}
		}
	});

	server.route({
		path: '/tasks/{taskId}/results/{resultId}',
		method: 'GET',

		handler: async ({params, query}, reply) => {
			const {taskId, resultId} = params;
			const result = await model.result.getByIdAndTaskId(resultId, taskId, query);

			if (!result) {
				return reply.response('Not Found').code(404);
			}
			return reply.response(result).code(200);
		},
		options: {
			validate: {
				query: Joi.object({
					full: Joi.boolean()
				}),
				payload: false
			}
		}
	});
};
