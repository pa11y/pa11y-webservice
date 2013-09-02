
Feature: GET /tasks/123/results

	Scenario: Get results by task ID
		When I GET the "tasks/123/results" endpoint
		Then I should get a 501 response

	Scenario: Get results by task ID within a date range
		When I GET the "tasks/123/results" endpoint with query:
			"""
			{
				"from": "2012-01-01",
				"to": "2013-01-01"
			}
			"""
		Then I should get a 501 response

	Scenario: Get results by task ID with full details
		When I GET the "tasks/123/results" endpoint with query:
			"""
			{
				"full": "true"
			}
			"""
		Then I should get a 501 response

	Scenario: Get results by task ID with an invalid query string
		When I GET the "tasks/123/results" endpoint with query:
			"""
			{
				"foo": "bar"
			}
			"""
		Then I should get a 400 response
