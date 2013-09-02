
Feature: DELETE /tasks/123

	Scenario: Delete a task by ID
		When I DELETE the "tasks/123" endpoint
		Then I should get a 501 response
