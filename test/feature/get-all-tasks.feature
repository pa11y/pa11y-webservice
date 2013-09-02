
Feature: GET /tasks

	Scenario: Get all tasks
		When I GET the "tasks" endpoint
		Then I should get a 501 response
