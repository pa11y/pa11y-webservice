
Feature: GET /tasks/123

	Scenario: Get a task by ID
		Given I have the tasks:
			| _id                      | url        | standard |
			| abc000000000000000000001 | nature.com | WCAG2AA  |
		When I GET the "tasks/abc000000000000000000001" endpoint
		Then I should get a 200 response
		And I should see a JSON representation of task "abc000000000000000000001"

	Scenario: Get a non-existent task by ID
		When I GET the "tasks/abc000000000000000000000" endpoint
		Then I should get a 404 response

	Scenario: Get a task with an invalid ID
		When I GET the "tasks/abc" endpoint
		Then I should get a 404 response

	Scenario: Get a task with a non-alphanumeric ID
		When I GET the "tasks/$$$" endpoint
		Then I should get a 400 response
