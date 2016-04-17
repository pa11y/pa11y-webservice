// This file is part of pa11y-webservice.
//
// pa11y-webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// pa11y-webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with pa11y-webservice.  If not, see <http://www.gnu.org/licenses/>.

/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');

describe('PATCH /tasks/{id}', function() {

	describe('with valid and existing task ID', function() {

		describe('with valid JSON', function() {
			var taskEdits;

			beforeEach(function(done) {
				taskEdits = {
					name: 'New Name',
					timeout: '30000',
					username: 'user',
					password: 'access',
					ignore: ['bar', 'baz'],
					comment: 'Just changing some stuff, you know'
				};
				var req = {
					method: 'PATCH',
					endpoint: 'tasks/abc000000000000000000001',
					body: taskEdits
				};
				this.navigate(req, done);
			});

			it('should update the task\'s name in the database', function(done) {
				this.app.model.task.getById('abc000000000000000000001', function(err, task) {
					assert.strictEqual(task.name, taskEdits.name);
					done();
				});
			});

			it('should update the task\'s username in the database', function(done) {
				this.app.model.task.getById('abc000000000000000000001', function(err, task) {
					assert.strictEqual(task.username, taskEdits.username);
					done();
				});
			});

			it('should update the task\'s password in the database', function(done) {
				this.app.model.task.getById('abc000000000000000000001', function(err, task) {
					assert.strictEqual(task.password, taskEdits.password);
					done();
				});
			});

			it('should update the task\'s ignore rules in the database', function(done) {
				this.app.model.task.getById('abc000000000000000000001', function(err, task) {
					assert.deepEqual(task.ignore, taskEdits.ignore);
					done();
				});
			});

			it('should add an annotation for the edit to the task', function(done) {
				this.app.model.task.getById('abc000000000000000000001', function(err, task) {
					assert.isArray(task.annotations);
					assert.isObject(task.annotations[0]);
					assert.strictEqual(task.annotations[0].comment, taskEdits.comment);
					assert.isNumber(task.annotations[0].date);
					assert.strictEqual(task.annotations[0].type, 'edit');
					done();
				});
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.last.status, 200);
			});

		});

		describe('with invalid name', function() {
			var taskEdits;

			beforeEach(function(done) {
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

			it('should send a 400 status', function() {
				assert.strictEqual(this.last.status, 400);
			});

		});

		describe('with URL', function() {
			var taskEdits;

			beforeEach(function(done) {
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

			it('should not the task in the database', function(done) {
				this.app.model.task.getById('abc000000000000000000001', function(err, task) {
					assert.notStrictEqual(task.name, taskEdits.name);
					assert.notStrictEqual(task.url, taskEdits.url);
					done();
				});
			});

			it('should send a 400 status', function() {
				assert.strictEqual(this.last.status, 400);
			});

		});

	});

	describe('with valid but non-existent task ID', function() {

		beforeEach(function(done) {
			var req = {
				method: 'PATCH',
				endpoint: 'tasks/abc000000000000000000000',
				body: {
					name: 'foo',
					timeout: '30000'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.last.status, 404);
		});

	});

	describe('with invalid task ID', function() {

		beforeEach(function(done) {
			var req = {
				method: 'PATCH',
				endpoint: 'tasks/-abc-',
				body: {
					name: 'foo',
					timeout: '30000'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.last.status, 404);
		});

	});

});
