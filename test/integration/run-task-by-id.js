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

const http = require('http');
const assert = require('proclaim');

const responseBody = `
<!doctype html>
<html>
	<head>
		<title>Integration Test</title>
	</head>
	<body>Content</body>
</html>
`;

describe('POST /tasks/{taskId}}/run', function() {

	describe('with valid and existing task ID', function() {
		let server;

		beforeEach(async function() {
			server = http.createServer(function(request, response) {
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.end(responseBody);
			});
			server.listen(8132);

			const request = {
				method: 'POST',
				endpoint: 'tasks/abc000000000000000000004/run'
			};
			await this.navigate(request);
		});

		afterEach(function(done) {
			server.close(done);
		});

		it('should send a 202 status', function() {
			assert.strictEqual(this.response.status, 202);
		});
	});

	describe('with valid but non-existent task ID', function() {

		beforeEach(async function() {
			const request = {
				method: 'POST',
				endpoint: 'tasks/abc000000000000000000000/run'
			};
			await this.navigate(request);
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.response.status, 404);
		});

	});

	describe('with invalid task ID', function() {
		beforeEach(async function() {
			await this.navigate({
				method: 'POST',
				endpoint: 'tasks/-abc-/run'
			});
		});

		it('should send a 404 status', function() {
			assert.strictEqual(this.response.status, 404);
		});
	});
});
