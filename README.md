# Pa11y Webservice

Pa11y Webservice is a Node.js app that provides scheduled accessibility reports for multiple URLs. It runs [Pa11y][pa11y] on a list of URLs, which you can update and query the results of via a JSON web-service.

Pa11y Webservice doesn't have a UI. In most scenarios, you may find easier to configure and run accessibility tests from [Pa11y Dashboard][pa11y-dashboard] than from Pa11y Webservice itself, so we recommend to have a look at it first.

If you're trying to run accessibility tests as part of a CI/CD system, you may want to use [Pa11y][pa11y] or [Pa11y CI][pa11y-ci] instead, as they better suited to these tasks.

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![GPL-3.0 licensed][shield-license]][info-license]

---

## Requirements

Pa11y Webservice is a [Node.js][node] application and requires a stable or LTS version of Node, currently version 8 or greater.

Pa11y Webservice also requires a [MongoDB][mongo] database to be available so it can store the results of the tests. The database doesn't have to be in the same server or computer where Pa11y Webservice is running from.

Since version 3, Pa11y Webservice uses Headless Chrome in order to run the tests. This means that additional dependencies maybe be required.

In [Unix-like](https://en.wikipedia.org/wiki/Unix-like) systems you may need to install the `libnss3` and `libgconf-2-4` libraries in order to be able to run Chrome. If you're trying to run the app in a headless environment (e.g. the cloud, or a headless server), you may also need to configure Xvfb before. Please refer to the documentation from your provider for details on how to do this.

## Setup

In order to run Pa11y Webservice, we recommend cloning this repository locally:

```sh
git clone https://github.com/pa11y/pa11y-webservice.git
```

Then installing the dependencies:

```sh
cd pa11y-webservice
npm install
```

The last step before being able to run the application is to define a configuration for it. This can be done in two ways:

### Option 1: Using Environment Variables

Each configuration can be set with an environment variable rather than a config file. For example to run the application on port `8080` you can use the following:

```sh
PORT=8080 npm start
```

The [available configurations are documented here](#configurations).

### Option 2: Using Config Files

The alternative to environment variables is to set the configuration in one or more JSON files. You can define as many config files as environments you're planning to run the app from. Each config file will contain the configuration for one of these environments or modes.

The mode that the app will run on can be set using the `NODE_ENV` environment variable. If no environment is defined, Pa11y Webservice will run in `development` mode. Common values for the `NODE_ENV` variable are `production`, `development` or `test`.

Pa11y Webservice will use the config file that matches the environment name. For example, if `NODE_ENV` equals `production`, the `production.json` config file will be used.

```sh
NODE_ENV=production npm start
# Will use the production.json config file
```

The `config/` directory contains three example config files. You can use these as a base to create your own configuration.

```sh
cp config/development.sample.json config/development.json
cp config/production.sample.json config/production.json
cp config/test.sample.json config/test.json
```

The [available configurations are documented here](#configurations).

Once the configuration has been created, the app can be run in the desired mode by changing the `NODE_ENV` environment variable:

```sh
NODE_ENV=development npm start
```

## API Documentation

The webservice which Pa11y Webservice exposes is documented in the wiki:

- [Webservice endpoints][wiki-web-service]
- [Resource types][wiki-resources]

## Client Libraries

- [Pa11y Webservice Node.js Client][pa11y-webservice-client-node]

## Configurations

If both environment variables _and_ a configuration file are present, the settings in the configuration file will override the environment variables.

The boot configurations for Pa11y Webservice are as follows. Look at the sample JSON files in the repo for example usage.

### database

*(string)* The mongodb [connection string][mongo-connection-string] for your database. Set via a config file or the `DATABASE` environment variable.

### host

*(string)* The host to run the application on. This is normally best left as `"0.0.0.0"` – which means the application will run on any incoming connections. Set via a config file or the `HOST` environment variable.

### port

*(number)* The port to run the application on. Set via a config file or the `PORT` environment variable.

### cron

*(string)* A crontab which describes when to generate reports for each task in the application. Set via a config file or the `CRON` environment variable.

### chromeLaunchConfig (config file only)

*(object)* Launch options for the Headless Chrome instance. See the [`chromeLaunchConfig`](https://github.com/pa11y/pa11y#chromelaunchconfig-object) documentation for configuration options.

This configuration option isn't available when you're using environment variables. [Use a JSON configuration file](https://github.com/pa11y/pa11y-webservice#option-2-using-config-files) if you need to pass these parameters.

## Contributing

There are many ways to contribute to Pa11y Webservice, we cover these in the [contributing guide](CONTRIBUTING.md) for this repo.

If you're ready to contribute some code, you'll need to clone the repo and get set up as outlined in the [setup guide](#setup). To run the test suite, remember to copy its config file with `cp config/test.sample.json config/test.json` if you haven't done so already! Manually start the application in test mode with:

```sh
NODE_ENV=test npm start
```

You'll now be able to run the following commands, either in a separate terminal session or by putting the server process into the background (`ctrl+z` then `bg`):

```sh
make verify              # Verify all of the code (ESLint)
make test                # Run all tests
make test-integration    # Run the integration tests
```

## Fixtures

For demoing Pa11y Webservice, you can insert some example tasks and results by running one of the following commands (depending on your environment):

```sh
NODE_ENV=development make fixtures
NODE_ENV=test make fixtures
```

## Support and Migration

Pa11y Webservice major versions are normally supported for 6 months after their last minor release. This means that patch-level changes will be added and bugs will be fixed. The table below outlines the end-of-support dates for major versions, and the last minor release for that version.

We also maintain a [migration guide](MIGRATION.md) to help you migrate.

| :grey_question: | Major Version | Last Minor Release | Node.js Versions | Support End Date |
| :-------------- | :------------ | :----------------- | :--------------- | :--------------- |
| :heart:         | 3             | N/A                | 8+               | N/A              |
| :hourglass:       | 2             | 2.3.1              | 4+               | 2020-01-04       |
| :skull:         | 1             | 1.11               | 0.10–6           | 2016-12-05       |

If you're opening issues related to these, please mention the version that the issue relates to.

## License

Pa11y Webservice is licensed under the [GNU General Public License 3.0][info-license].<br/>
Copyright &copy; 2013–2019, Team Pa11y and contributors

[gpl]: http://www.gnu.org/licenses/gpl-3.0.html
[mongo]: http://www.mongodb.org/
[mongo-connection-string]: http://docs.mongodb.org/manual/reference/connection-string/
[node]: http://nodejs.org/
[pa11y]: https://github.com/pa11y/pa11y
[pa11y-ci]: https://github.com/pa11y/pa11y-ci
[pa11y-dashboard]: https://github.com/pa11y/pa11y-dashboard
[pa11y-docs]: https://github.com/pa11y/pa11y#installing
[pa11y-webservice-client-node]: https://github.com/pa11y/pa11y-webservice-client-node
[phantom]: http://phantomjs.org/
[travis]: https://travis-ci.org/pa11y/pa11y-webservice
[travis-img]: https://travis-ci.org/pa11y/pa11y-webservice.png?branch=master
[wiki-web-service]: https://github.com/pa11y/pa11y-webservice/wiki/Web-Service-Endpoints
[wiki-resources]: https://github.com/pa11y/pa11y-webservice/wiki/Resource-Types

[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/pa11y-webservice
[info-build]: https://travis-ci.org/pa11y/pa11y-webservice
[shield-license]: https://img.shields.io/badge/license-GPL%203.0-blue.svg
[shield-node]: https://img.shields.io/node/v/pa11y-webservice
[shield-npm]: https://img.shields.io/npm/v/pa11y-webservice.svg
[shield-build]: https://img.shields.io/travis/pa11y/pa11y-webservice/master.svg
