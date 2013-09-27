'use strict';

var app = require('../../app');
var async = require('async');

module.exports = loadFixtures;

function loadFixtures (env, done) {
    env = (env || 'development');
    var config = require('../../config/' + env + '.json');
    var fixtures = {
        results: require('./' + env + '/results.js'),
        tasks: require('./' + env + '/tasks.js')
    };

    config.dbOnly = true;

    app(config, function (err, app) {
        async.series([
            clearDatabase.bind(null, app),
            insertFixtures.bind(null, app, fixtures)
        ], function () {
            app.db.close();
            done();
        });
    });
}

function clearDatabase (app, done) {
    async.parallel([
        app.model.result.collection.remove.bind(app.model.result.collection),
        app.model.task.collection.remove.bind(app.model.task.collection)
    ], done);
}

function insertFixtures (app, fixtures, done) {
    async.series([

        function (next) {
            async.parallel(fixtures.tasks.map(function (task) {
                return app.model.task.create.bind(null, task);
            }), next);
        },

        function (next) {
            async.parallel(fixtures.results.map(function (result) {
                return app.model.result.create.bind(null, result);
            }), next);
        }

    ], done);
}
