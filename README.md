# Pa11y Webservice

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![GPL-3.0 licensed][shield-license]][info-license]

---

Pa11y Webservice is a Node.js service that can schedule accessibility testing, using [Pa11y][pa11y], for multiple URLs.

Use this service if you're ready to interact with a restful API to coordinate your testing. For other scenarios, another Pa11y tool may be more appropriate:

- [Pa11y Dashboard][pa11y-dashboard] provides a visual interface
- [Pa11y CI][pa11y-ci], and [Pa11y][pa11y] itself, can be executed from the command line, which is likely to be more useful for accessibility testing as part of a CI/CD workflow

## Requirements

Pa11y Webservice is a [Node.js][node] application designed to support a stable/LTS version of Node. Pa11y 4 requires Node.js version 12, 14 or 16.

The service stores test results in a [MongoDB][mongo] database, and expects one to be available and running.

Pa11y (and therefore this service) uses Headless Chrome to perform accessibility testing, the installation of which sometimes requires additional dependencies to be required on Linux and other Unix-like systems. Your distribution's documentation should describe how to install these.

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

## API documentation

The webservice which Pa11y Webservice exposes is documented in the wiki:

- [Webservice endpoints][wiki-web-service]
- [Resource types][wiki-resources]

## Client libraries

- [Pa11y Webservice Node.js Client][pa11y-webservice-client-node]

## Configurations

If both environment variables _and_ a configuration file are present, the settings in the configuration file will override the environment variables.

The boot configurations for Pa11y Webservice are as follows. Look at the sample JSON files in the repo for example usage.

### `database`

*(string)* The mongodb [connection string][mongo-connection-string] for your database. Set via a config file or the `DATABASE` environment variable.

### `host`

*(string)* The host to run the application on. This is normally best left as `"0.0.0.0"` – which means the application will run on any incoming connections. Set via a config file or the `HOST` environment variable.

### `port`

*(number)* The port to run the application on. Set via a config file or the `PORT` environment variable.

### `cron`

*(string)* A crontab which describes when to generate reports for each task in the application. Set via a config file or the `CRON` environment variable.

### `chromeLaunchConfig` (config file only)

*(object)* Launch options for the Headless Chrome instance. See the [`chromeLaunchConfig`](https://github.com/pa11y/pa11y#chromelaunchconfig-object) documentation for configuration options.

This option can only be provided by [a JSON configuration file](https://github.com/pa11y/pa11y-webservice#option-2-using-config-files). It can't be set with an environment variable.

### `numWorkers`

*(number)* The concurrency limit or number of workers that will be running concurrently on each cron execution. Set via a config file or the `NUM_WORKERS` environment variable.

## Contributing

There are many ways to contribute to Pa11y Webservice, we cover these in the [contributing guide](CONTRIBUTING.md) for this repo.

If you're ready to contribute some code, follow the [setup guide](#setup). The project can be linted and unit tested immediately:

```sh
make lint           # Lint the code
make test-unit      # Run the unit tests
```

The integration tests require the service to be running in the background, since they'll be checking its behaviour.

1. Create a configuration file for the `test` mode; one can be created quickly with `cp config/test.sample.json config/test.json`
1. Start the service in test mode with:
   ```sh
   NODE_ENV=test npm start &
   ```

   The `&` places the service into the background. An alternative approach is to run `NODE_ENV=test npm start`, suspend the process with `CTRL+z`, and finally run `bg` to place it into the background.
1. ```sh
   make test-integration    # Run the integration tests
   make test                # Run both the integration tests and the unit tests mentioned above
   ```

## Fixtures

For demoing Pa11y Webservice, you can insert some example tasks and results by running one of the following commands, depending on your environment:

```sh
NODE_ENV=development make fixtures
```

```sh
NODE_ENV=test make fixtures
```

## Support and migration

> [!NOTE]
> We maintain a [migration guide](MIGRATION.md) to help you migrate between major versions.

When we release a new major version we will continue to support the previous major version for 6 months. This support will be limited to fixes for critical bugs and security issues. If you're opening an issue related to this project, please mention the specific version that the issue affects.

The following table lists the major versions available and, for each previous major version, its end-of-support date, and its final minor version released.

| Major version | Final minor version | Node.js support  | Support end date |
| :------------ | :-----------------  | :--------------- | :--------------- |
| 4             | N/A                 | 12, 14, 16       | N/A              |
| 3             | 3.2.1               | 8, 10            | 2022-05-26       |
| 2             | 2.3.1               | 4, 6             | 2020-01-04       |
| 1             | 1.11                | 0.10, 0.12, 4, 6 | 2016-12-05       |


## License

Pa11y Webservice is licensed under the [GNU General Public License 3.0][info-license].
Copyright &copy; 2013–2023, Team Pa11y and contributors

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
[info-build]: https://github.com/pa11y/pa11y-webservice/actions/workflows/tests.yml
[shield-license]: https://img.shields.io/badge/license-GPL%203.0-blue.svg
[shield-node]: https://img.shields.io/node/v/pa11y-webservice
[shield-npm]: https://img.shields.io/npm/v/pa11y-webservice.svg
[shield-build]: https://github.com/pa11y/pa11y-webservice/actions/workflows/tests.yml/badge.svg
