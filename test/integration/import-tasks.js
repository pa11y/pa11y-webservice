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
var ObjectID = require('mongodb').ObjectID;

describe('POST /tasks/import', function() {

	describe('with valid JSON', function() {
		var newTask1;
		var newTask2;

		beforeEach(function(done) {
			newTask1 = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA',
				ignore: ['foo', 'bar']
			};
			newTask2 = {
				name: 'NPG Home 2',
				url: 'nature.com 2',
				timeout: '30000',
				standard: 'WCAG2AA',
				ignore: ['foo', 'bar']
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask1, newTask2]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask1, function(error, task) {
				assert.isDefined(task);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new tasks', function() {
			assert.isDefined(this.last.body[0].id);
			assert.isDefined(this.last.body[1].id);
			assert.strictEqual(this.last.body[0].name, newTask1.name);
			assert.strictEqual(this.last.body[0].url, newTask1.url);
			assert.strictEqual(this.last.body[0].standard, newTask1.standard);
			assert.strictEqual(this.last.body[1].name, newTask2.name);
			assert.strictEqual(this.last.body[1].url, newTask2.url);
			assert.strictEqual(this.last.body[1].standard, newTask2.standard);
			assert.deepEqual(this.last.body[0].ignore, newTask1.ignore || []);
			assert.deepEqual(this.last.body[1].ignore, newTask2.ignore || []);
		});

	});

	describe('with valid JSON and HTTP basic user authentication', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA',
				username: 'user',
				password: 'access',
				ignore: ['foo', 'bar'],
				hideElements: 'foo'
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(error, task) {
				assert.isDefined(task);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body[0].id);
			assert.strictEqual(this.last.body[0].name, newTask.name);
			assert.strictEqual(this.last.body[0].url, newTask.url);
			assert.strictEqual(this.last.body[0].username, newTask.username);
			assert.strictEqual(this.last.body[0].password, newTask.password);
			assert.strictEqual(this.last.body[0].standard, newTask.standard);
			assert.deepEqual(this.last.body[0].ignore, newTask.ignore || []);
			assert.deepEqual(this.last.body[0].hideElements, newTask.hideElements);
		});

	});

	describe('with valid JSON and no ignore rules', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA'
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(error, task) {
				assert.isDefined(task);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body[0].id);
			assert.strictEqual(this.last.body[0].name, newTask.name);
			assert.strictEqual(this.last.body[0].url, newTask.url);
			assert.strictEqual(this.last.body[0].standard, newTask.standard);
			assert.deepEqual(this.last.body[0].ignore, []);
		});

	});

	describe('with valid JSON and wait time', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				wait: 1000,
				standard: 'WCAG2AA'
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(error, task) {
				assert.isDefined(task);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body[0].id);
			assert.strictEqual(this.last.body[0].name, newTask.name);
			assert.strictEqual(this.last.body[0].url, newTask.url);
			assert.strictEqual(this.last.body[0].standard, newTask.standard);
			assert.deepEqual(this.last.body[0].wait, newTask.wait);
			assert.deepEqual(this.last.body[0].ignore, []);
		});

	});

	describe('with valid JSON and hideElements', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				wait: 1000,
				standard: 'WCAG2AA',
				hideElements: '.text-gray-light,.full-width'
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(error, task) {
				assert.isDefined(task);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body[0].id);
			assert.strictEqual(this.last.body[0].name, newTask.name);
			assert.strictEqual(this.last.body[0].url, newTask.url);
			assert.strictEqual(this.last.body[0].standard, newTask.standard);
			assert.deepEqual(this.last.body[0].wait, newTask.wait);
			assert.deepEqual(this.last.body[0].hideElements, newTask.hideElements);
			assert.deepEqual(this.last.body[0].ignore, []);
		});

	});

	describe('with valid JSON and actions', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				wait: 1000,
				standard: 'WCAG2AA',
				actions: [
					'click element div',
					'click element body'
				]
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(error, task) {
				assert.isDefined(task);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body[0].id);
			assert.strictEqual(this.last.body[0].name, newTask.name);
			assert.strictEqual(this.last.body[0].url, newTask.url);
			assert.strictEqual(this.last.body[0].standard, newTask.standard);
			assert.deepEqual(this.last.body[0].wait, newTask.wait);
			assert.deepEqual(this.last.body[0].actions, newTask.actions);
			assert.deepEqual(this.last.body[0].ignore, []);
		});

	});

	describe('with valid JSON and headers object', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				standard: 'WCAG2AA',
				headers: {
					foo: 'bar'
				}
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne({
				_id: new ObjectID(this.last.response.body[0].id)
			}, function(error, task) {
				assert.isDefined(task);
				assert.deepEqual(task.headers, newTask.headers);
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.deepEqual(this.last.body[0].headers, newTask.headers);
		});

	});

	describe('with valid JSON and headers string', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				standard: 'WCAG2AA',
				headers: '{"foo":"bar"}'
			};
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [newTask]
			};
			this.navigate(request, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne({
				_id: new ObjectID(this.last.response.body[0].id)
			}, function(error, task) {
				assert.isDefined(task);
				assert.deepEqual(task.headers, {
					foo: 'bar'
				});
				done(error);
			});
		});

		it('should send a 200 status', function() {
			assert.strictEqual(this.last.status, 200);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/';
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.deepEqual(this.last.body[0].headers, {
				foo: 'bar'
			});
		});

	});

	describe('with invalid name', function() {

		beforeEach(function(done) {
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [{
					name: null,
					url: 'nature.com',
					standard: 'WCAG2AA'
				}]
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with invalid URL', function() {

		beforeEach(function(done) {
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [{
					url: null,
					standard: 'WCAG2AA'
				}]
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with invalid standard', function() {

		beforeEach(function(done) {
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [{
					url: 'nature.com',
					standard: 'foo'
				}]
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with a non-array actions', function() {

		beforeEach(function(done) {
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [{
					name: 'NPG Home',
					url: 'nature.com',
					standard: 'WCAG2AA',
					actions: 'wat?'
				}]
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with invalid actions', function() {

		beforeEach(function(done) {
			var request = {
				method: 'POST',
				endpoint: 'tasks/import',
				body: [{
					name: 'NPG Home',
					url: 'nature.com',
					standard: 'WCAG2AA',
					actions: [
						'foo',
						'bar'
					]
				}]
			};
			this.navigate(request, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 200);
			assert.deepEqual(this.last.body[0], {
				message: 'Invalid action: "foo"',
				statusCode: 400
			});
		});

	});

});
