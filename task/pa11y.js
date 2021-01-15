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
const {green, grey, red} = require('kleur');
const {CronJob} = require('cron');

module.exports = initTask;
exports.runPa11yOnTasks = runPa11yOnTasks;

// Initialise the task
function initTask(config, app) {
	if (!config.cron) {
		config.cron = '0 30 0 * * *'; // 00:30 daily
	}
	const job = new CronJob(config.cron, taskRunner.bind(null, app));
	job.start();
}

// Runs the task
async function taskRunner(app) {
	console.log('');
	console.log(grey('Starting to run task @ %s'), new Date());

	try {
		const tasks = await app.model.task.getAll();
		runPa11yOnTasks(tasks, app);
	} catch (error) {
		console.error(red('Failed to run task: %s'), error.message);
		console.log('');
		process.exit(1);
	}
}

// Runs an array of pa11y tasks
function runPa11yOnTasks(tasks, app) {
	if (tasks.length === 0) {
		console.log('No pa11y tasks to run');
		return;
	}

	const worker = async task => {
		console.log('Starting pa11y task %s', task.id);
		try {
			await app.model.task.runById(task.id);
			console.log(green('Finished pa11y task %s'), task.id);
		} catch (error) {
			console.log(red('Failed to finish pa11y task %s: %s'), task.id, error.message);
		}
	};

	const queue = async.queue(worker, app.config.numWorkers);
	queue.push(tasks);

	queue.drain(() => {
		console.log(grey('Finished running pa11y tasks @ %s'), new Date());
	});
}
