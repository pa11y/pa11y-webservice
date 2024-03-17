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

describe('GET /tasks', function() {

	describe('with no query', function() {

		beforeEach(async function() {
			const request = {
				method: 'GET',
				endpoint: 'tasks'
			};
			await this.navigate(request);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.response.status, 200);
		});

		it('should output a JSON representation of all tasks sorted by URL/standard', async function() {
			const body = this.response.body;
			const tasks = await this.app.model.task.getAll();
			assert.isArray(body);
			assert.strictEqual(body.length, 4);
			assert.deepEqual(body, tasks);
		});

	});

	describe('with last result query', function() {

		beforeEach(async function() {
			const request = {
				method: 'GET',
				endpoint: 'tasks',
				query: {
					lastres: true
				}
			};
			await this.navigate(request);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.response.status, 200);
		});

		it('should output a JSON representation of all tasks including their last result', function(done) {
			const body = this.response.body;
			assert.isArray(body);
			assert.strictEqual(body.length, 4);

			assert.strictEqual(body[0].id, 'abc000000000000000000001');
			assert.isObject(body[0].last_result);
			assert.strictEqual(body[0].last_result.id, 'def000000000000000000001');

			assert.strictEqual(body[1].id, 'abc000000000000000000002');
			assert.isObject(body[1].last_result);
			assert.strictEqual(body[1].last_result.id, 'def000000000000000000002');

			assert.strictEqual(body[2].id, 'abc000000000000000000003');
			assert.strictEqual(body[2].last_result, null);

			assert.strictEqual(body[3].id, 'abc000000000000000000004');
			assert.strictEqual(body[3].last_result, null);

			done();
		});

	});

});
