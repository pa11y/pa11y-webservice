
Feature: GET /tasks/run

	Scenario: Run all tasks
		When I GET the "tasks/run" endpoint
		Then I should get a 501 response
