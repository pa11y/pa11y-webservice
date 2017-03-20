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

describe('GET /tasks/results', function() {

	describe('with no query', function() {

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks/results'
			};
			this.navigate(request, done);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all results (in the last 30 days) sorted by date', function(done) {
			var body = this.last.body;
			this.app.model.result.getAll({}, function(error, results) {
				assert.isArray(body);
				assert.strictEqual(body.length, 4);
				assert.strictEqual(body[0].id, 'def000000000000000000001');
				assert.isUndefined(body[0].results);
				assert.strictEqual(body[1].id, 'def000000000000000000002');
				assert.isUndefined(body[1].results);
				assert.strictEqual(body[2].id, 'def000000000000000000003');
				assert.isUndefined(body[2].results);
				assert.strictEqual(body[3].id, 'def000000000000000000004');
				assert.isUndefined(body[3].results);
				assert.deepEqual(body, results);
				done();
			});
		});

	});

	describe('with date-range query', function() {
		var query;

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks/results',
				query: {
					from: '2013-01-02',
					to: '2013-01-07'
				}
			};
			query = request.query;
			this.navigate(request, done);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all expected results sorted by date', function(done) {
			var body = this.last.body;
			this.app.model.result.getAll(query, function(error, results) {
				assert.isArray(body);
				assert.strictEqual(body.length, 2);
				assert.strictEqual(body[0].id, 'def000000000000000000007');
				assert.isUndefined(body[0].results);
				assert.strictEqual(body[1].id, 'def000000000000000000006');
				assert.isUndefined(body[1].results);
				assert.deepEqual(body, results);
				done();
			});
		});

	});

	describe('with full details query', function() {
		var query;

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks/results',
				query: {
					full: true
				}
			};
			query = request.query;
			this.navigate(request, done);
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should output a JSON representation of all results (in the last 30 days) with full details sorted by date', function(done) {
			var body = this.last.body;
			this.app.model.result.getAll(query, function(error, results) {
				assert.isArray(body);
				assert.strictEqual(body.length, 4);
				assert.strictEqual(body[0].id, 'def000000000000000000001');
				assert.isArray(body[0].results);
				assert.strictEqual(body[1].id, 'def000000000000000000002');
				assert.isArray(body[1].results);
				assert.strictEqual(body[2].id, 'def000000000000000000003');
				assert.isArray(body[2].results);
				assert.strictEqual(body[3].id, 'def000000000000000000004');
				assert.isArray(body[3].results);
				assert.deepEqual(body, results);
				done();
			});
		});

	});

	describe('with invalid query', function() {

		beforeEach(function(done) {
			var request = {
				method: 'GET',
				endpoint: 'tasks/results',
				query: {
					foo: 'bar'
				}
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

});
