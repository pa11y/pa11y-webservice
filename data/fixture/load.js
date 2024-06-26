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

const {promisify} = require('util');
const application = require('../../app');

async function loadFixtures(mode, config) {
	mode = (mode || 'development');

	const fixtures = {
		results: require(`./${mode}/results.js`),
		tasks: require(`./${mode}/tasks.js`)
	};

	config.dbOnly = true;

	const app = await promisify(application)(config);

	// Clear existing content
	await app.model.result.collection.deleteMany();
	await app.model.task.collection.deleteMany();

	// Insert new content
	await Promise.all(fixtures.tasks.map(task => app.model.task.create(task)));
	await Promise.all(fixtures.results.map(result => app.model.result.create(result)));
	await app.client.close();
}

module.exports = loadFixtures;
