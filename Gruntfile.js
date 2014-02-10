// This file is part of pa11y-webservice.
// 
// pa11y-webservice is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// pa11y-webservice is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with pa11y-webservice.  If not, see <http://www.gnu.org/licenses/>.

/* jshint maxstatements: false */
module.exports = function (grunt) {

	grunt.initConfig({

		fixture: {
			dev: 'development',
			test: 'test'
		},

		jshint: {
			all: [
				'data/**/*.js', 'Gruntfile.js', 'index.js', 'route/**/*.js',
				'test/**/*.js', 'task/**/*.js'
			],
			options: {
				camelcase: false,
				es3: false,
				indent: 4,
				latedef: false,
				maxcomplexity: 4,
				maxdepth: 2,
				maxlen: 100,
				maxparams: 4,
				maxstatements: 10,
				node: true,
				quotmark: 'single'
			}
		},

		mochaTest: {
			functional: {
				src: ['test/functional/*.js'],
				options: {
					reporter: 'spec'
				}
			}
		},

		nodemon: {
			development: {
				options: {
					cwd: __dirname,
					file: 'index.js',
					env: {
						NODE_ENV: 'development'
					}
				}
			},
			test: {
				options: {
					cwd: __dirname,
					file: 'index.js',
					env: {
						NODE_ENV: 'test'
					}
				}
			}
		}

	});

	grunt.registerMultiTask('fixture', 'Load fixtures into the database.', function () {
		var done = this.async();
		var loadFixtures = require('./data/fixture/load');
		loadFixtures(this.data, require('./config/' + this.data + '.json'), function (err) {
			if (err) {
				grunt.log.error(err.message);
				return done(false);
			}
			grunt.log.writeln('Fixtures added');
			done();
		});
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('start', ['nodemon:development']);
	grunt.registerTask('start-test', ['nodemon:test']);
	grunt.registerTask('default', ['lint', 'test']);
	grunt.registerTask('ci', ['lint', 'test']);

};