
# Changelog

## 1.11.0 (2016-05-26)

  * Update Node.js version support to 0.10–6.0
  * Update dependencies
    * async: ~1.4 to ~1.5
    * cron: ~1.0 to ~1.1
    * freeport: removed
    * hapi: ~1.9 to ~9.3
    * joi: added at ~6.10
    * mongodb: ~2.0 to ~2.1
    * pa11y: ~3.6 to ~3.7
    * request: ~2.61 to ^2
  * Update references/links to the new Pa11y organisation

## 1.10.0 (2016-05-22)

  * Add the ability to configure task wait times

## 1.9.0 (2016-05-18)

  * Allow configuration by environment variables
  * Fix an issue with the HTTP auth feature
  * Fix typos

## 1.8.1 (2016-04-25)

  * Correct an out-of-date error message

## 1.8.0 (2016-04-17)

  * Add a `SIGINT` handler
  * Switch from Grunt to Make
  * Fix all lint errors
  * Update dependencies
    * pa11y: ~3.0 to ~3.6

## 1.7.0 (2016-03-16)

  * Save all Pa11y results rather than choosing certain properties
  * Fix the `npm start` script
  * Display startup errors in the logs

## 1.6.4 (2016-02-09)

  * Update Node.js version support

## 1.6.3 (2015-10-16)

  * Update dependencies
    * pa11y: ~2.4 to ~3.0

## 1.6.2 (2015-08-20)

  * Update dependencies
    * mongodb: ~1.3 to ~2.0

## 1.6.1 (2015-07-07)

  * Make PhantomJS port finding more robust

## 1.6.0 (2015-07-06)

  * Add the ability to configure task username and password (basic auth)

## 1.5.1 (2015-07-02)

  * Update dependencies
    * pa11y: ~1.6 to ~2.3

## 1.5.0 (2015-07-02)

  * Add the ability to configure task timeouts

## 1.4.0 (2015-01-17)

  * Update dependencies
    * pa11y: ~1.5 to ~1.6

## 1.3.2 (2014-03-15)

  * Fix the documentation for starting the app

## 1.3.1 (2014-02-10)

  * Add the GPL preamble to all files

## 1.3.0 (2013-12-11)

  * Add ignore rules to result fixtures
  * Store the currently active ignore rules on results

## 1.2.0 (2013-11-27)

  * Index task names
  * Add edit annotations to tasks
  * Add an endpoint for task editing

## 1.1.1 (2013-11-21)

  * Restructure the way fixtures are loaded

## 1.1.0 (2013-11-21)

  * Fix typos
  * Remove supervisor
  * Add build status to the README
  * Add a Travis config

## 1.0.0 (2013-11-19)

  * Initial stable release

## 1.0.0-beta.9 pre-release (2013-11-15)

  * Sort tasks by name first
  * Add a list of client libraries

## 1.0.0-beta.8 pre-release (2013-11-11)

  * Add a "name" property to tasks
  * Add a grunt task for running in test/development

## 1.0.0-beta.7 pre-release (2013-11-05)

  * Move from Make to Grunt
  * Add indices to collections
  * Update dependencies
    * pa11y: ~1.4 to ~1.5

## 1.0.0-beta.6 pre-release (2013-10-03)

  * Add the ability to run a single task ad-hoc

## 1.0.0-beta.5 pre-release (2013-09-27)

  * Add more varied data to fixtures, and add development fixtures

## 1.0.0-beta.4 pre-release (2013-09-25)

  * Add full details to individual task when last result is requested
  * Remove related results when a task is deleted

## 1.0.0-beta.3 pre-release (2013-09-20)

  * Add an endpoint for getting a single result
  * Fix typos

## 1.0.0-beta.2 pre-release (2013-09-16)

  * Allow requesting the last result for a task in the API

## 1.0.0-beta.1 pre-release (2013-09-12)

  * Initial release
