/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

describe('DELETE /tasks/{id}', function () {

	describe('with valid and existing task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'DELETE',
				endpoint: 'tasks/abc000000000000000000001'
			};
			this.navigate(req, done);
		});

		it('should remove the task from the database', function (done) {
			this.app.model.task.getById('abc000000000000000000001', function (err, task) {
				assert.isNull(task);
				done();
			});
		});

		it('should send a 204 status', function () {
			assert.strictEqual(this.last.status, 204);
		});

	});

	describe('with valid but non-existent task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'DELETE',
				endpoint: 'tasks/abc000000000000000000000'
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
				method: 'DELETE',
				endpoint: 'tasks/-abc-'
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function () {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
