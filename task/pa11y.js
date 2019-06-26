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

const async = require('async');
const chalk = require('chalk');
const {CronJob} = require('cron');

module.exports = initTask;
exports.runPa11yOnTasks = runPa11yOnTasks;

// Initialise the task
function initTask(config, app) {

	if (!config.cron) {
		config.cron = '0 30 0 * * *'; // 00:30 daily
	}
	const job = new CronJob(config.cron, run.bind(null, app));
	job.start();

}

// Run the task
function run(app) {

	console.log('');
	console.log(chalk.grey('Starting to run tasks @ %s'), new Date());

	async.waterfall([

		next => app.model.task.getAll(next),

		(tasks, next) => runPa11yOnTasks(tasks, app, next)

	], error => {

		if (error) {
			console.error(chalk.red('Failed to run tasks: %s'), error.message);
			console.log('');
			process.exit(1);
		}

	});

}

// Run Pa11y on an array of tasks
function runPa11yOnTasks(tasks, app, done) {

	const queue = async.queue((task, nextInQueue) => {
		console.log('Starting task %s', task.id);
		app.model.task.runById(task.id, error => {
			if (error) {
				console.log(chalk.red('Failed to finish task %s: %s'), task.id, error.message);
			} else {
				console.log(chalk.green('Finished task %s'), task.id);
			}
			nextInQueue();
		});

	}, 2);

	queue.drain = () => {
		console.log(chalk.grey('Finished running tasks @ %s'), new Date());
		done();
	};

	queue.push(tasks);

}
