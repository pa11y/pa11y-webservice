'use strict';

var async = require('async');
var chalk = require('chalk');
var CronJob = require('cron').CronJob;

module.exports = initTask;
exports.runPa11yOnTasks = runPa11yOnTasks;

// Initialise the task
function initTask (config, app) {
	if (!config.cron) {
		config.cron = '0 30 0 * * *'; // 00:30 daily
	}
	var job = new CronJob(config.cron, run.bind(null, app));
	job.start();
}

// Run the task
function run (app) {
	console.log('');
	console.log(chalk.grey('Starting to run tasks @ %s'), new Date());
	async.waterfall([

		function (next) {
			app.model.task.getAll(next);
		},

		function (tasks, next) {
			runPa11yOnTasks(tasks, app, next);
		}

	], function (err) {
		if (err) {
			console.error(chalk.red('Failed to run tasks: %s'), err.message);
			console.log('');
			process.exit(1);
		}
	});
}

// Run pa11y on an array of tasks
function runPa11yOnTasks (tasks, app, done) {

	var queue = async.queue(function (task, nextInQueue) {
		console.log('Starting task %s', task.id);
		app.model.task.runById(task.id, function (err) {
			if (err) {
				console.log(chalk.red('Failed to finish task %s: %s'), task.id, err.message);
			} else {
				console.log(chalk.green('Finished task %s'), task.id);
			}
			nextInQueue();
		});
	}, 2);

	queue.drain = function() {
		console.log(chalk.grey('Finished running tasks @ %s'), new Date());
		done();
	};

	queue.push(tasks);

}