
pa11y-ws
========

pa11y-ws provides scheduled accessibility reports for multiple URLs. It runs [pa11y][pa11y] on a list of URLs, which you can update and query the results of via a JSON web-service.

**Current Version:** *0.0.0*  
**Node Version Support:** *0.10*


Setup
-----

pa11y-ws requires [Node.js][node] 0.10+ and [PhantomJS][phantom]. See the [pa11y documentation][pa11y-docs] for more information on these dependencies. pa11y-ws also requires [MongoDB][mongo] to be installed and running.

You'll then need to clone this repo locally and install dependencies with `npm install`. Once you have a local clone, you'll need to copy some sample configuration files in order to run the application. From within the repo, run the following commands:

```sh
$ cp config/development.sample.json config/development.json
$ cp config/production.sample.json config/production.json
$ cp config/test.sample.json config/test.json
```

Each of these files defines configurations for a different environment. If you're just running the application locally, then you should be OK with just development and test configurations. The [available configurations are documented here](#configurations).

Now that you've got your application configured, you can run in each mode with the following commands:

```sh
$ make start       # start in production mode
$ make start-dev   # start in development mode
$ make start-test  # start in test mode
```

Both development and test modes run the application with [Supervisor][supervisor], so you won't need to restart it if you change any JavaScript files.


Configurations
--------------

The boot configurations for pa11y-ws are as follows. Look at the sample JSON files in the repo for example usage.

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

To develop pa11y-ws, you'll need to clone the repo and get set up as outlined in the [setup guide](#setup). Once you've done this, you'll need to start the application in test mode with:

```sh
$ make start-test
```

Now you'll be able to run the following commands:

```sh
$ make lint  # Run JSHint with the correct config
$ make test  # Run tests
```

Code with lint errors or failing tests will not be accepted, please use the build tools outlined above.

For users with push-access, don't commit to the master branch. Code should be in `develop` until it's ready to be released.


License
-------

[Copyright 2013 Nature Publishing Group](LICENSE.txt).  
pa11y-ws is licensed under the [GNU General Public License 3.0][gpl].



[brew]: http://mxcl.github.com/homebrew/
[make]: http://gnuwin32.sourceforge.net/packages/make.htm
[gpl]: http://www.gnu.org/licenses/gpl-3.0.html
[mongo]: http://www.mongodb.org/
[mongo-connection-string]: http://docs.mongodb.org/manual/reference/connection-string/
[node]: http://nodejs.org/
[pa11y]: https://github.com/nature/pa11y
[pa11y-docs]: https://github.com/nature/pa11y#installing
[phantom]: http://phantomjs.org/
[rules]: https://github.com/nature/pa11y/wiki/HTML-CodeSniffer-Rules
[supervisor]: https://github.com/isaacs/node-supervisor
