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

const app = require('../../app');

module.exports = loadFixtures;

function loadFixtures(env, config, done) {
	env = (env || 'development');
	const fixtures = {
		results: require('./' + env + '/results.js'),
		tasks: require('./' + env + '/tasks.js')
	};

	config.dbOnly = true;

	app(config, async function(error, app) {
		if (error) {
			done(error);
		}
		// Clear existing content
		await app.model.result.collection.remove();
		await app.model.task.collection.remove();

		// Insert new content
		await Promise.all(fixtures.tasks.map(async function(task) {
			return await app.model.task.create(task);
		}));
		await Promise.all(fixtures.results.map(async function(result) {
			return await app.model.result.create(result);
		}));

		await app.db.close();
		done();
	});
}
