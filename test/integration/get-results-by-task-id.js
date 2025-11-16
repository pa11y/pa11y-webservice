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

const assert = require('proclaim');

describe('GET /tasks/{taskId}}/results', function() {

	describe('with valid and existing task ID', function() {

		describe('with no query', function() {

			beforeEach(async function() {
				const request = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results'
				};
				await this.navigate(request);
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.response.status, 200);
			});

			it('should output a JSON representation of all expected results sorted by date', async function() {
				const {body} = this.response;
				const taskId = 'abc000000000000000000002';
				const results = await this.app.model.result.getByTaskId(taskId, {});
				assert.isArray(body);
				assert.strictEqual(body.length, 2);
				assert.strictEqual(body[0].id, 'def000000000000000000002');
				assert.isUndefined(body[0].results);
				assert.strictEqual(body[1].id, 'def000000000000000000004');
				assert.isUndefined(body[1].results);
				assert.deepEqual(body, results);
			});

		});

		describe('with date-range query', function() {
			let query;

			beforeEach(async function() {
				const request = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results',
					query: {
						from: '2013-01-02',
						to: '2013-01-07'
					}
				};
				({query} = request);
				await this.navigate(request);
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.response.status, 200);
			});

			it('should output a JSON representation of all expected results sorted by date', async function() {
				const {body} = this.response;
				const taskId = 'abc000000000000000000002';
				const results = await this.app.model.result.getByTaskId(taskId, query);
				assert.isArray(body);
				assert.strictEqual(body.length, 1);
				assert.strictEqual(body[0].id, 'def000000000000000000006');
				assert.isUndefined(body[0].results);
				assert.deepEqual(body, results);
			});

		});

		describe('with full details query', function() {
			let query;

			beforeEach(async function() {
				const request = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results',
					query: {
						full: true
					}
				};
				({query} = request);
				await this.navigate(request);
			});

			it('should send a 200 status', function() {
				assert.strictEqual(this.response.status, 200);
			});

			it('should output a JSON representation of all results (in the last 30 days) with full details sorted by date', async function() {
				const {body} = this.response;
				const taskId = 'abc000000000000000000002';
				const results = await this.app.model.result.getByTaskId(taskId, query);
				assert.isArray(body);
				assert.strictEqual(body.length, 2);
				assert.strictEqual(body[0].id, 'def000000000000000000002');
				assert.isArray(body[0].results);
				assert.strictEqual(body[1].id, 'def000000000000000000004');
				assert.isArray(body[1].results);
				assert.deepEqual(body, results);
			});

		});

		describe('with invalid query', function() {

			beforeEach(async function() {
				const request = {
					method: 'GET',
					endpoint: 'tasks/abc000000000000000000002/results',
					query: {
						foo: 'bar'
					}
				};
				await this.navigate(request);
			});

			it('should send a 400 status', function() {
				assert.strictEqual(this.response.status, 400);
			});

		});

	});

	describe('with valid but non-existent task ID', function() {

		beforeEach(async function() {
			const request = {
				method: 'GET',
				endpoint: 'tasks/abc000000000000000000000/results'
			};
			await this.navigate(request);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.response.status, 404);
		});

	});

	describe('with invalid task ID', function() {

		beforeEach(async function() {
			const request = {
				method: 'GET',
				endpoint: 'tasks/-abc-/results'
			};
			await this.navigate(request);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.response.status, 404);
		});

	});

});
