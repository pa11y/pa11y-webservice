/* global beforeEach, describe, it */
/* jshint maxlen: 200, maxstatements: 20 */
'use strict';

var assert = require('proclaim');

describe('GET /tasks/{id}/results', function () {

	describe('with valid and existing task ID', function () {

		describe('with no query', function () {

			beforeEach(function (done) {
				var req = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results'
				};
				this.navigate(req, done);
			});

			it('should send a 200 status', function () {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of all expected results sorted by date', function (done) {
				var body = this.last.body;
				this.app.model.result.getByTaskId('abc000000000000000000002', {}, function (err, results) {
					assert.isArray(body);
					assert.strictEqual(body.length, 2);
					assert.strictEqual(body[0].id, 'def000000000000000000002');
					assert.isUndefined(body[0].results);
					assert.strictEqual(body[1].id, 'def000000000000000000004');
					assert.isUndefined(body[1].results);
					assert.deepEqual(body, results);
					done();
				});
			});

		});

		describe('with date-range query', function () {
			var query;

			beforeEach(function (done) {
				var req = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results',
					query: {
						from: '2013-01-02',
						to: '2013-01-07'
					}
				};
				query = req.query;
				this.navigate(req, done);
			});

			it('should send a 200 status', function () {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of all expected results sorted by date', function (done) {
				var body = this.last.body;
				this.app.model.result.getByTaskId('abc000000000000000000002', query, function (err, results) {
					assert.isArray(body);
					assert.strictEqual(body.length, 1);
					assert.strictEqual(body[0].id, 'def000000000000000000006');
					assert.isUndefined(body[0].results);
					assert.deepEqual(body, results);
					done();
				});
			});

		});

		describe('with full details query', function () {
			var query;

			beforeEach(function (done) {
				var req = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results',
					query: {
						full: true
					}
				};
				query = req.query;
				this.navigate(req, done);
			});

			it('should send a 200 status', function () {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of all results (in the last 30 days) with full details sorted by date', function (done) {
				var body = this.last.body;
				this.app.model.result.getByTaskId('abc000000000000000000002', query, function (err, results) {
					assert.isArray(body);
					assert.strictEqual(body.length, 2);
					assert.strictEqual(body[0].id, 'def000000000000000000002');
					assert.isArray(body[0].results);
					assert.strictEqual(body[1].id, 'def000000000000000000004');
					assert.isArray(body[1].results);
					assert.deepEqual(body, results);
					done();
				});
			});

		});

		describe('with invalid query', function () {

			beforeEach(function (done) {
				var req = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results',
					query: {
						foo: 'bar'
					}
				};
				this.navigate(req, done);
			});

			it('should send a 400 status', function () {
				assert.strictEqual(this.last.status, 400);
			});

		});

	});

	describe('with valid but non-existent task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'GET',
				endpoint: 'tasks/abc000000000000000000000/results'
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
				endpoint: 'tasks/-abc-/results'
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function () {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
