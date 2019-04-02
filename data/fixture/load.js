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
		await clearDatabase(app);
		await insertFixtures(app, fixtures);
		await app.db.close();
		console.log('Done loading fixtures.');
		done();
	});
}

async function clearDatabase(app) {
	console.log('clearDatabase');
	await app.model.result.collection.remove();
	await app.model.task.collection.remove();
}

async function insertFixtures(app, fixtures) {
	console.log('insertFixtures');

	await fixtures.tasks.forEach(async function(task) {
		console.log('Going to insert task fixture.', task);
		await app.model.task.create(task);
	});

	await fixtures.results.forEach(async function(result) {
		console.log('Going to insert result fixture.', result);
		await app.model.result.create(result);
	});

}
