
Feature: DELETE /tasks/123

	Scenario: Delete a task by ID
		Given I have the tasks:
			| _id                      | url        | standard |
			| abc000000000000000000001 | nature.com | WCAG2AA  |
		When I DELETE the "tasks/abc000000000000000000001" endpoint
		Then I should get a 204 response
		And task "abc000000000000000000001" should not be in the database

	Scenario: Delete a non-existent task by ID
		When I DELETE the "tasks/abc000000000000000000000" endpoint
		Then I should get a 404 response

	Scenario: Delete a task with an invalid ID
		When I DELETE the "tasks/abc" endpoint
		Then I should get a 404 response

	Scenario: Delete a task with a non-alphanumeric ID
		When I DELETE the "tasks/$$$" endpoint
		Then I should get a 400 response
