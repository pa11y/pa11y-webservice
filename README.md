
pa11y-webservice
================

pa11y-webservice provides scheduled accessibility reports for multiple URLs. It runs [pa11y][pa11y] on a list of URLs, which you can update and query the results of via a JSON web-service.

**Current Version:** *1.6.3*  
**Build Status:** [![Build Status][travis-img]][travis]  
**Node Version Support:** *0.12*


Setup
-----

pa11y-webservice requires [Node.js][node] 0.12+ and [PhantomJS][phantom]. See the [pa11y documentation][pa11y-docs] for more information on these dependencies. pa11y-webservice also requires [MongoDB][mongo] to be installed and running.

You'll then need to clone this repo locally and install dependencies with `npm install`. Once you have a local clone, you'll need to copy some sample configuration files in order to run the application. From within the repo, run the following commands:

```sh
$ cp config/development.sample.json config/development.json
$ cp config/production.sample.json config/production.json
$ cp config/test.sample.json config/test.json
```

Each of these files defines configurations for a different environment. If you're just running the application locally, then you should be OK with just development and test configurations. The [available configurations are documented here](#configurations).

Now that you've got your application configured, you can run in each mode with the following commands:

```sh
$ NODE_ENV=production node index.js   # Run in production
$ NODE_ENV=development node index.js  # Run in development
$ NODE_ENV=test node index.js         # Run in test
```

See [development instructions](#development) for more information about running locally (and restarting automatically when files change).


Documentation
-------------

The web-service which pa11y-webservice exposes is documented in the wiki:

- [Web-Service endpoints][wiki-web-service]
- [Resource types][wiki-resources]


Client Libraries
----------------

- Node.js client library: [pa11y-webservice-client-node][pa11y-webservice-client-node]


Configurations
--------------

The boot configurations for pa11y-webservice are as follows. Look at the sample JSON files in the repo for example usage.

### database
*(string)* The mongodb [connection string][mongo-connection-string] for your database.

### host
*(string)* The host to run the application on. This is normally best left as `"0.0.0.0"` – which means the application will run on any incoming connections.

### port
*(number)* The port to run the application on.

### cron
*(string)* A crontab which describes when to generate reports for each task in the application.


Development
-----------

To develop pa11y-webservice, you'll need to clone the repo and get set up as outlined in the [setup guide](#setup). You'll also need [Grunt][grunt] to be installed globally in order to run tests, you can do this with `npm install -g grunt-cli`.

Once you've done this, you'll need to start the application in test mode with:

```sh
$ grunt start-test
```

Now you'll be able to run the following commands:

```sh
$ grunt             # Run the lint and test tasks together
$ grunt lint        # Run JSHint with the correct config
$ grunt start       # Run app in development mode, restarting if files change
$ grunt start-test  # Run app in test mode, restarting if files change
$ grunt test   # Run functional tests
```

Code with lint errors or failing tests will not be accepted, please use the build tools outlined above.

For users with push-access, don't commit to the master branch. Code should be in `develop` until it's ready to be released.


Fixtures
--------

For demoing pa11y-webservice, you can insert some example tasks and results by running the following command:

```sh
$ grunt fixture:dev
```


License
-------

[Copyright 2013 Nature Publishing Group](LICENSE.txt).  
pa11y-webservice is licensed under the [GNU General Public License 3.0][gpl].



[brew]: http://mxcl.github.com/homebrew/
[gpl]: http://www.gnu.org/licenses/gpl-3.0.html
[grunt]: http://gruntjs.com/
[mongo]: http://www.mongodb.org/
[mongo-connection-string]: http://docs.mongodb.org/manual/reference/connection-string/
[node]: http://nodejs.org/
[pa11y]: https://github.com/nature/pa11y
[pa11y-docs]: https://github.com/nature/pa11y#installing
[pa11y-webservice-client-node]: https://github.com/nature/pa11y-webservice-client-node
[phantom]: http://phantomjs.org/
[travis]: https://travis-ci.org/nature/pa11y-webservice
[travis-img]: https://travis-ci.org/nature/pa11y-webservice.png?branch=master
[wiki-web-service]: https://github.com/nature/pa11y-webservice/wiki/Web-Service-Endpoints
[wiki-resources]: https://github.com/nature/pa11y-webservice/wiki/Resource-Types
