
Feature: GET /tasks/123

	Scenario: Get a task by ID
		When I GET the "tasks/123" endpoint
		Then I should get a 501 response

	Scenario: Get a task with an invalid ID
		When I GET the "tasks/$$$" endpoint
		Then I should get a 400 response
