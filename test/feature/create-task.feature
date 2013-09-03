
Feature: POST /tasks

	Scenario: Create a task
		When I POST the "tasks" endpoint with JSON:
			"""
			{
				"url": "nature.com",
				"standard": "WCAG2AA",
				"ignore": [
					"foo",
					"bar"
				]
			}
			"""
		Then I should get a 201 response
		And I should see a JSON representation of the new task
		And I should see a Location header pointing to the new task
		And the new task should be added to the database

	Scenario: Create a task with no ignore rules
		When I POST the "tasks" endpoint with JSON:
			"""
			{
				"url": "nature.com",
				"standard": "WCAG2AA"
			}
			"""
		Then I should get a 201 response
		And I should see a JSON representation of the new task
		And I should see a Location header pointing to the new task
		And the new task should be added to the database

	Scenario: Create a task with an invalid URL
		When I POST the "tasks" endpoint with JSON:
			"""
			{
				"url": null,
				"standard": "WCAG2AA"
			}
			"""
		Then I should get a 400 response

	Scenario: Create a task with an invalid standard
		When I POST the "tasks" endpoint with JSON:
			"""
			{
				"url": "nature.com",
				"standard": "foo"
			}
			"""
		Then I should get a 400 response
