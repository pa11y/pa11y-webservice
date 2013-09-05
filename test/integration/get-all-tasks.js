/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
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

});
