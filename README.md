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

Clone this repository:

```sh
git clone https://github.com/pa11y/pa11y-webservice.git
```

Now install its dependencies:

```sh
cd pa11y-webservice
npm install
```

We're nearly ready to run the service, but first we must provide some configuration.

## Configuration

The service can be configured using either runtime environment variables or a configuration file. When both are present, the configuration file will override the environment. We provide sample versions of the [configuration file](config). 

Each option which can be configured is documented [here](#configurations), listed by its JSON-file property name - the environment variable equivalent is identical, but upper-snake-cased.

### Configuration using environment variables

To configure a port for the service, say, `8080`, the relevant environment variable is `PORT`:

```sh
PORT=8080 npm start
```

### Configuration using a JSON file

Configuration in a JSON file. You could, for example, define a separate JSON file for each of several contexts. We label each of these a 'mode'. 

The mode is set by the `NODE_ENV` environment variable, and defaults to `development` when it's absent. Pa11y Webservice will use the config file with the name `{mode}.json`. For example, providing `NODE_ENV=production` would lead to the service looking for `production.json`.

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

### List of configuration options

#### `database`

*(string)* The MongoDB [connection string][mongo-connection-string] for your database.

Env equivalent: `DATABASE`.

#### `host`

*(string)* The host to run the application on. This is normally best left as `"0.0.0.0"`, which means the application will run on any incoming connections.

Env equivalent: `HOST`.

#### `port`

*(number)* The port to run the application on.

Env equivalent: `PORT`.

#### `cron`

*(string)* A crontab which describes when to generate reports for each task in the application.

Env equivalent: `CRON`.

#### `numWorkers`

*(number)* The concurrency limit or number of workers that will be running concurrently on each cron execution. Set via a config file or the `NUM_WORKERS` environment variable.

Env equivalent: `NUM_WORKERS`.

#### `chromeLaunchConfig` (config file only)

*(object)* Launch options for the Headless Chrome instance. See the [`chromeLaunchConfig`](https://github.com/pa11y/pa11y#chromelaunchconfig-object) documentation for configuration options.

Env equivalent: none. This option can only be defined by a file.

## API documentation

Our wiki documents the interface presented by this webservice:

- [Webservice endpoints][wiki-web-service]
- [Resource types][wiki-resources]

## Client libraries

- [Pa11y Webservice Node.js Client][pa11y-webservice-client-node]

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
| 4             |                     | 12, 14, 16       | ✅ Current major version |
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
[pa11y-webservice-client-node]: https://github.com/pa11y/pa11y-webservice-client-node
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
