'use strict';

var Hapi = require('hapi');
var config = require('./config/' + (process.env.NODE_ENV || 'development') + '.json');

var server = new Hapi.Server(config.host, config.port, {});

server.addRoutes(require('./route/tasks'));
server.addRoutes(require('./route/task'));

server.start(function () {
	console.log('pa11y-ws started at: %s', server.info.uri);
});
