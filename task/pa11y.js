'use strict';

var async = require('async');
var chalk = require('chalk');
var CronJob = require('cron').CronJob;
var pa11y = require('pa11y');

module.exports = initTask;

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

	var ports = [12400, 12401, 12402, 12403, 12404, 12405, 12406, 12407, 12408, 12409];

	var queue = async.queue(function (task, nextInQueue) {
		var port = ports.shift();
		console.log('Starting task %s (port %d)', task.id, port);

		async.waterfall([

			function (next) {
				pa11y.sniff({
					url: task.url,
					standard: task.standard,
					config: {
						ignore: task.ignore
					},
					port: port
				}, next);
			},

			function (results, next) {
				results.task = task.id;
				app.model.result.create(results, next);
			}

		], function (err) {
			if (err) {
				console.log(chalk.red('Failed to finish task %s: %s'), task.id, err.message);
			} else {
				console.log(chalk.green('Finished task %s'), task.id);
			}
			ports.push(port);
			nextInQueue();
		});

	}, 2);

	queue.drain = function() {
		console.log(chalk.grey('Finished running tasks @ %s'), new Date());
		done();
	};

	queue.push(tasks);

}