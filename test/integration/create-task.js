/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

describe('POST /tasks', function () {

	describe('with valid JSON', function () {
		var newTask;

		beforeEach(function (done) {
			newTask = {
				url: 'nature.com',
				standard: 'WCAG2AA',
				ignore: ['foo', 'bar']
			};
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function (done) {
			this.app.model.task.collection.findOne(newTask, function (err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function () {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function () {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function () {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.ignore, newTask.ignore || []);
		});

	});

	describe('with valid JSON and no ignore rules', function () {
		var newTask;

		beforeEach(function (done) {
			newTask = {
				url: 'nature.com',
				standard: 'WCAG2AA'
			};
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function (done) {
			this.app.model.task.collection.findOne(newTask, function (err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function () {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function () {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function () {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.ignore, []);
		});

	});

	describe('with invalid URL', function () {

		beforeEach(function (done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					url: null,
					standard: 'WCAG2AA'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 400 status', function () {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with invalid standard', function () {

		beforeEach(function (done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					url: 'nature.com',
					standard: 'foo'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 400 status', function () {
			assert.strictEqual(this.last.status, 400);
		});

	});

});
