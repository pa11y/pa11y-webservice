
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
		And a task with a URL of "nature.com" should be present
		And a task with a standard of "WCAG2AA" should be present
		And a task which ignores the "foo" rule should be present
		And a task which ignores the "bar" rule should be present

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
		And a task with a URL of "nature.com" should be present
		And a task with a standard of "WCAG2AA" should be present

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
