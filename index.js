
var Hapi = require('hapi');
var config = require('./config/' + (process.env.NODE_ENV || 'development') + '.json');
var routes = require('./routes');

// Create/start server
var server = new Hapi.Server(config.host, config.port, {});
server.addRoutes(routes);
server.start(function () {
	console.log('pa11y-ws started at: %s', server.info.uri);
});
