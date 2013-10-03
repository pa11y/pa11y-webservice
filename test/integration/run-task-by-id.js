/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

describe('POST /tasks/{id}/run', function () {

	describe('with valid and existing task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks/abc000000000000000000001/run'
			};
			this.navigate(req, done);
		});

		it('should send a 202 status', function () {
			assert.strictEqual(this.last.status, 202);
		});

	});

	describe('with valid but non-existent task ID', function () {

		beforeEach(function (done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks/abc000000000000000000000/run'
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
				method: 'POST',
				endpoint: 'tasks/-abc-/run'
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function () {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
