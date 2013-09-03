
Feature: GET /tasks/results

	Scenario: Get all results
		Given I have the results:
			"""
			[
				{"task": "abc000000000000000000001", "count": {"error": 1, "warning": 2, "notice": 3, "total": 6}, "results": ["foo"]},
				{"task": "abc000000000000000000002", "count": {"error": 2, "warning": 3, "notice": 4, "total": 9}, "results": ["foo"]},
				{"task": "abc000000000000000000003", "count": {"error": 3, "warning": 4, "notice": 5, "total": 12}, "results": ["foo"]}
			]
			"""
		When I GET the "tasks/results" endpoint
		Then I should get a 200 response
		And I should see a JSON representation of all results sorted by date

	Scenario: Get all results within a date range
		Given I have the results:
			"""
			[
				{"_id": "abc000000000000000000001", "date": 1356998400000, "task": "abc000000000000000000004"},
				{"_id": "abc000000000000000000002", "date": 1357344000000, "task": "abc000000000000000000005"},
				{"_id": "abc000000000000000000003", "date": 1357776000000, "task": "abc000000000000000000006"}
			]
			"""
		When I GET the "tasks/results" endpoint with query:
			"""
			{
				"from": "2013-01-03",
				"to": "2013-01-08"
			}
			"""
		Then I should get a 200 response
		And I should see a JSON representation of result "abc000000000000000000002"
		And I should not see a JSON representation of result "abc000000000000000000001"
		And I should not see a JSON representation of result "abc000000000000000000003"

	Scenario: Get all results with full details
		Given I have the results:
			"""
			[
				{"task": "abc000000000000000000001", "count": {"error": 1, "warning": 2, "notice": 3, "total": 6}, "results": ["foo"]},
				{"task": "abc000000000000000000002", "count": {"error": 2, "warning": 3, "notice": 4, "total": 9}, "results": ["foo"]},
				{"task": "abc000000000000000000003", "count": {"error": 3, "warning": 4, "notice": 5, "total": 12}, "results": ["foo"]}
			]
			"""
		When I GET the "tasks/results" endpoint with query:
			"""
			{
				"full": "true"
			}
			"""
		Then I should get a 200 response
		And I should see a JSON representation of all results sorted by date with full details

	Scenario: Get all results with an invalid query string
		When I GET the "tasks/results" endpoint with query:
			"""
			{
				"foo": "bar"
			}
			"""
		Then I should get a 400 response
