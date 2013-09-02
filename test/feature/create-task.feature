
Feature: POST /tasks

	Scenario: Create a task
		When I POST the "tasks" endpoint with JSON:
			"""
			{
				"url": "nature.com",
				"standard": "WCAG2AA",
				"ignore": []
			}
			"""
		Then I should get a 501 response

	Scenario: Create a task with no ignore rules
		When I POST the "tasks" endpoint with JSON:
			"""
			{
				"url": "nature.com",
				"standard": "WCAG2AA"
			}
			"""
		Then I should get a 501 response

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
