/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

describe('PATCH /tasks/{id}', function () {

	describe('with valid and existing task ID', function () {

		describe('with valid JSON', function () {
			var taskEdits;

			beforeEach(function (done) {
				taskEdits = {
					name: 'New Name',
					ignore: ['bar', 'baz']
				};
				var req = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				this.navigate(req, done);
			});

			it('should update the task\'s name in the database', function (done) {
				this.app.model.task.getById('abc000000000000000000001', function (err, task) {
					assert.strictEqual(task.name, taskEdits.name);
					done();
				});
			});

			it('should update the task\'s ignore rules in the database', function (done) {
				this.app.model.task.getById('abc000000000000000000001', function (err, task) {
					assert.deepEqual(task.ignore, taskEdits.ignore);
					done();
				});
			});

			it('should send a 200 status', function () {
				assert.strictEqual(this.last.status, 200);
			});

		});

		describe('with invalid name', function () {
			var taskEdits;

			beforeEach(function (done) {
				taskEdits = {
					name: null
				};
				var req = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				this.navigate(req, done);
			});

			it('should send a 400 status', function () {
				assert.strictEqual(this.last.status, 400);
			});

		});

		describe('with URL', function () {
			var taskEdits;

			beforeEach(function (done) {
				taskEdits = {
					name: 'New Name',
					url: 'http://example.com/'
				};
				var req = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				this.navigate(req, done);
			});

			it('should not the task in the database', function (done) {
				this.app.model.task.getById('abc000000000000000000001', function (err, task) {
					assert.notStrictEqual(task.name, taskEdits.name);
					assert.notStrictEqual(task.url, taskEdits.url);
					done();
				});
			});

			it('should send a 400 status', function () {
				assert.strictEqual(this.last.status, 400);
			});

		});

	});

	describe('with valid but non-existent task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'PATCH',
				endpoint: 'tasks/abc000000000000000000000',
				body: {
					name: 'foo'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function () {
			assert.strictEqual(this.last.status, 404);
		});

	});

	describe('with invalid task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'PATCH',
				endpoint: 'tasks/-abc-',
				body: {
					name: 'foo'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function () {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
