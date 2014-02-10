// This file is part of pa11y-webservice.
// 
// pa11y-webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// pa11y-webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with pa11y-webservice.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

var _ = require('underscore');
var Hapi = require('hapi');

// Routes relating to all tasks
module.exports = function (app) {
	var model = app.model;
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
					if (req.query.lastres) {
						model.result.getAll({}, function (err, results) {
							if (err || !results) {
								return req.reply().code(500);
							}
							var resultsByTask = _.groupBy(results, 'task');
							tasks = tasks.map(function (task) {
								if (resultsByTask[task.id] && resultsByTask[task.id].length) {
									task.last_result = resultsByTask[task.id][0];
								} else {
									task.last_result = null;
								}
								return task;
							});
							req.reply(tasks).code(200);
						});
					} else {
						req.reply(tasks).code(200);
					}
				});
			},
			config: {
				validate: {
					query: {
						lastres: Hapi.types.Boolean()
					},
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
						name: Hapi.types.String().required(),
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
