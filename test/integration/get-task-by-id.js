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

describe('GET /tasks/{id}', function() {

	describe('with valid and existing task ID', function() {

		describe('with no query', function() {

			beforeEach(function(done) {
				var request = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000001'
				};
				this.navigate(request, done);
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of the requested task', function(done) {
				var body = this.last.body;
				this.app.model.task.getById('abc000000000000000000001', function(error, task) {
					assert.isObject(body);
					assert.strictEqual(body.id, 'abc000000000000000000001');
					assert.deepEqual(body, task);
					done();
				});
			});

		});

		describe('with last result query', function() {

			beforeEach(function(done) {
				var request = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000001',
					query: {
						lastres: true
					}
				};
				this.navigate(request, done);
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.last.status, 200);
			});

			it('should output a JSON representation of the requested task including the last result (with full details)', function(done) {
				var body = this.last.body;
				this.app.model.task.getById('abc000000000000000000001', function() {
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

	describe('with valid but non-existent task ID', function() {

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks/abc000000000000000000000'
			};
			this.navigate(request, done);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.last.status, 404);
		});

	});

	describe('with invalid task ID', function() {

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks/-abc-'
			};
			this.navigate(request, done);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
