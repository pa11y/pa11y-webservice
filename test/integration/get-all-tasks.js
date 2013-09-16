/* global beforeEach, describe, it */
/* jshint maxlen: 200, maxstatements: 20 */
'use strict';

var assert = require('proclaim');

describe('GET /tasks', function () {

	describe('with no query', function () {

		beforeEach(function (done) {
			var req = {
				method: 'GET',
				endpoint: 'tasks'
			};
			this.navigate(req, done);
		});

		it('should send a 200 status', function () {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all tasks sorted by URL/standard', function (done) {
			var body = this.last.body;
			this.app.model.task.getAll(function (err, tasks) {
				assert.isArray(body);
				assert.strictEqual(body.length, 3);
				assert.deepEqual(body, tasks);
				done();
			});
		});

	});

	describe('with last result query', function () {

		beforeEach(function (done) {
			var req = {
				method: 'GET',
				endpoint: 'tasks',
				query: {
					lastres: true
				}
			};
			this.navigate(req, done);
		});

		it('should send a 200 status', function () {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all tasks including their last result', function (done) {
			var body = this.last.body;
			assert.isArray(body);
			assert.strictEqual(body.length, 3);
			assert.strictEqual(body[0].id, 'abc000000000000000000001');
			assert.isObject(body[0].last_result);
			assert.strictEqual(body[0].last_result.id, 'def000000000000000000001');
			assert.strictEqual(body[1].id, 'abc000000000000000000002');
			assert.isObject(body[1].last_result);
			assert.strictEqual(body[1].last_result.id, 'def000000000000000000002');
			assert.strictEqual(body[2].id, 'abc000000000000000000003');
			assert.strictEqual(body[2].last_result, null);
			done();
		});

	});

});
