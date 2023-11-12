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

const getJsonResponseBody = async response => {
	try {
		return await response.json();
	} catch {
		try {
			const text = await response.text();
			if (text) {
				throw Error(`Expected nothing or JSON, found: ${text}`);
			}
		} catch {
			return null;
		}
	}
};

module.exports = (baseUrl, store) =>
	async ({endpoint, method, body, query}) => {
		const querystring = query ? `?${new URLSearchParams(query).toString()}` : '';

		const url = `${baseUrl}${endpoint}${querystring}`;

		const options = {
			method: method || 'GET',
			headers: {'Content-Type': 'application/json'},
			body: body && JSON.stringify(body)
		};

		const response = await fetch(url, options);
		store.status = response.status;
		store.responseHeaders = Object.fromEntries(response.headers.entries());
		store.body = await getJsonResponseBody(response);
	};
