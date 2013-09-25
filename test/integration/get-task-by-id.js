/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

describe('GET /tasks/{id}', function () {

	describe('with valid and existing task ID', function () {

		describe('with no query', function () {

			beforeEach(function (done) {
				var req = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000001'
				};
				this.navigate(req, done);
			});

			it('should send a 200 status', function () {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of the requested task', function (done) {
				var body = this.last.body;
				this.app.model.task.getById('abc000000000000000000001', function (err, task) {
					assert.isObject(body);
					assert.strictEqual(body.id, 'abc000000000000000000001');
					assert.deepEqual(body, task);
					done();
				});
			});

		});

		describe('with last result query', function () {

			beforeEach(function (done) {
				var req = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000001',
					query: {
						lastres: true
					}
				};
				this.navigate(req, done);
			});

			it('should send a 200 status', function () {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of the requested task including the last result (with full details)', function (done) {
				var body = this.last.body;
				this.app.model.task.getById('abc000000000000000000001', function () {
					assert.isObject(body);
					assert.strictEqual(body.id, 'abc000000000000000000001');
					assert.isObject(body.last_result);
					assert.strictEqual(body.last_result.id, 'def000000000000000000001');
					assert.isArray(body.last_result.results);
					done();
				});
			});

		});

	});

	describe('with valid but non-existent task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'GET',
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
				method: 'GET',
				endpoint: 'tasks/-abc-'
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function () {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
