
Feature: GET /tasks/results

	Scenario: Get all results
		When I GET the "tasks/results" endpoint
		Then I should get a 501 response

	Scenario: Get all results within a date range
		When I GET the "tasks/results" endpoint with query:
			"""
			{
				"from": "2012-01-01",
				"to": "2013-01-01"
			}
			"""
		Then I should get a 501 response

	Scenario: Get all results with full details
		When I GET the "tasks/results" endpoint with query:
			"""
			{
				"full": "true"
			}
			"""
		Then I should get a 501 response

	Scenario: Get all results with an invalid query string
		When I GET the "tasks/results" endpoint with query:
			"""
			{
				"foo": "bar"
			}
			"""
		Then I should get a 400 response
