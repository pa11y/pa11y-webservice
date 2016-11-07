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

/* global beforeEach, describe, it */
/* jshint maxlen: 200 */
'use strict';

var assert = require('proclaim');
var ObjectID = require('mongodb').ObjectID;

describe('POST /tasks', function() {

	describe('with valid JSON', function() {
		var newTask;

		beforeEach(function(done) {
			newTask = {
				name: 'NPG Home',
				url: 'nature.com',
				timeout: '30000',
				standard: 'WCAG2AA',
				ignore: ['foo', 'bar']
			};
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.name, newTask.name);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.ignore, newTask.ignore || []);
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
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.name, newTask.name);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.username, newTask.username);
			assert.strictEqual(this.last.body.password, newTask.password);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.ignore, newTask.ignore || []);
			assert.deepEqual(this.last.body.hideElements, newTask.hideElements);
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
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.name, newTask.name);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.ignore, []);
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
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.name, newTask.name);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.wait, newTask.wait);
			assert.deepEqual(this.last.body.ignore, []);
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
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne(newTask, function(err, task) {
				assert.isDefined(task);
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.isDefined(this.last.body.id);
			assert.strictEqual(this.last.body.name, newTask.name);
			assert.strictEqual(this.last.body.url, newTask.url);
			assert.strictEqual(this.last.body.standard, newTask.standard);
			assert.deepEqual(this.last.body.wait, newTask.wait);
			assert.deepEqual(this.last.body.hideElements, newTask.hideElements);
			assert.deepEqual(this.last.body.ignore, []);
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
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne({
				_id: new ObjectID(this.last.response.body.id)
			}, function(err, task) {
				assert.isDefined(task);
				assert.deepEqual(task.headers, newTask.headers);
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.deepEqual(this.last.body.headers, newTask.headers);
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
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: newTask
			};
			this.navigate(req, done);
		});

		it('should add the new task to the database', function(done) {
			this.app.model.task.collection.findOne({
				_id: new ObjectID(this.last.response.body.id)
			}, function(err, task) {
				assert.isDefined(task);
				assert.deepEqual(task.headers, {
					foo: 'bar'
				});
				done(err);
			});
		});

		it('should send a 201 status', function() {
			assert.strictEqual(this.last.status, 201);
		});

		it('should send a location header pointing to the new task', function() {
			var taskUrl = 'http://' + this.last.request.uri.host + '/tasks/' + this.last.body.id;
			assert.strictEqual(this.last.response.headers.location, taskUrl);
		});

		it('should output a JSON representation of the new task', function() {
			assert.deepEqual(this.last.body.headers, {
				foo: 'bar'
			});
		});

	});

	describe('with invalid name', function() {

		beforeEach(function(done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					name: null,
					url: 'nature.com',
					standard: 'WCAG2AA'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with invalid URL', function() {

		beforeEach(function(done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					url: null,
					standard: 'WCAG2AA'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

	describe('with invalid standard', function() {

		beforeEach(function(done) {
			var req = {
				method: 'POST',
				endpoint: 'tasks',
				body: {
					url: 'nature.com',
					standard: 'foo'
				}
			};
			this.navigate(req, done);
		});

		it('should send a 400 status', function() {
			assert.strictEqual(this.last.status, 400);
		});

	});

});
