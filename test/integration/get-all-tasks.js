// This file is part of Pa11y Webservice.
//
// Pa11y Webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Pa11y Webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Pa11y Webservice.  If not, see <http://www.gnu.org/licenses/>.
'use strict';

var assert = require('proclaim');

describe('GET /tasks', function() {

	describe('with no query', function() {

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks'
			};
			this.navigate(request, done);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all tasks sorted by URL/standard', function(done) {
			var body = this.last.body;
			this.app.model.task.getAll(function(error, tasks) {
				assert.isArray(body);
				assert.strictEqual(body.length, 3);
				assert.deepEqual(body, tasks);
				done();
			});
		});

	});

	describe('with last result query', function() {

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks',
				query: {
					lastres: true
				}
			};
			this.navigate(request, done);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all tasks including their last result', function(done) {
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
