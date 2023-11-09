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

const Joi = require('joi');
const groupBy = require('lodash.groupby');
const {isValidAction} = require('pa11y');

module.exports = function(app) {
	const {model, server} = app;

	// Get all tasks
	server.route({
		path: '/tasks',
		method: 'GET',

		handler: async (request, reply) => {
			let tasks = await model.task.getAll();

			if (!tasks) {
				return reply.response().code(500);
			}
			if (request.query.lastres) {
				const results = await model.result.getAll({});
				if (!results) {
					return reply.response().code(500);
				}
				const resultsByTask = groupBy(results, 'task');
				tasks = tasks.map(task => {
					/* eslint-disable-next-line camelcase */
					task.last_result =
						resultsByTask[task.id]?.length ?
							resultsByTask[task.id][0] :
							null;

					return task;
				});
			}

			return reply.response(tasks).code(200);
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
		path: '/tasks',
		method: 'POST',

		handler: async (request, reply) => {
			const invalidAction = request.payload.actions?.find(action => !isValidAction(action));
			if (invalidAction) {
				return reply.response(`Invalid action: "${invalidAction}"`).code(400);
			}

			const task = await model.task.create(request.payload);

			if (!task) {
				return reply.response().code(500);
			}

			return reply.response(task)
				.header('Location', `http://${request.info.host}/tasks/${task.id}`)
				.code(201);
		},
		options: {
			validate: {
				query: Joi.object({}),
				payload: Joi.object({
					name: Joi.string().required(),
					timeout: Joi.number().integer(),
					wait: Joi.number().integer(),
					url: Joi.string().required(),
					username: Joi.string().allow(''),
					password: Joi.string().allow(''),
					standard: Joi.string().required().valid(
						'Section508',
						'WCAG2A',
						'WCAG2AA',
						'WCAG2AAA'
					),
					ignore: Joi.array(),
					actions: Joi.array().items(Joi.string()),
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
		path: '/tasks/results',
		method: 'GET',

		handler: async (request, reply) => {
			const results = await model.result.getAll(request.query);
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

};
