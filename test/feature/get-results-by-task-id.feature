
Feature: GET /tasks/123/results

	Scenario: Get results by task ID
		Given I have the tasks:
			| _id                      | url        | standard |
			| abc000000000000000000001 | nature.com | WCAG2AA  |
		And I have the results:
			"""
			[
				{"_id": "abc000000000000000000003", "task": "abc000000000000000000001", "count": {"error": 1, "warning": 2, "notice": 3, "total": 6}, "results": ["foo"]},
				{"_id": "abc000000000000000000004", "task": "abc000000000000000000002", "count": {"error": 2, "warning": 3, "notice": 4, "total": 9}, "results": ["foo"]},
				{"_id": "abc000000000000000000005", "task": "abc000000000000000000001", "count": {"error": 3, "warning": 4, "notice": 5, "total": 12}, "results": ["foo"]}
			]
			"""
		When I GET the "tasks/abc000000000000000000001/results" endpoint
		Then I should get a 200 response
		And I should see a JSON representation of result "abc000000000000000000003"
		And I should see a JSON representation of result "abc000000000000000000005"
		And I should not see a JSON representation of result "abc000000000000000000004"

	Scenario: Get results by task ID within a date range
		Given I have the tasks:
			| _id                      | url        | standard |
			| abc000000000000000000001 | nature.com | WCAG2AA  |
		And I have the results:
			"""
			[
				{"_id": "abc000000000000000000003", "date": 1356998400000, "task": "abc000000000000000000001"},
				{"_id": "abc000000000000000000004", "date": 1357344000000, "task": "abc000000000000000000001"},
				{"_id": "abc000000000000000000005", "date": 1357776000000, "task": "abc000000000000000000001"},
				{"_id": "abc000000000000000000006", "date": 1357344000000, "task": "abc000000000000000000002"}
			]
			"""
		When I GET the "tasks/abc000000000000000000001/results" endpoint with query:
			"""
			{
				"from": "2013-01-03",
				"to": "2013-01-08"
			}
			"""
		Then I should get a 200 response
		
		And I should see a JSON representation of result "abc000000000000000000004"
		And I should not see a JSON representation of result "abc000000000000000000003"
		And I should not see a JSON representation of result "abc000000000000000000005"
		And I should not see a JSON representation of result "abc000000000000000000006"

	Scenario: Get results by task ID with full details
		Given I have the tasks:
			| _id                      | url        | standard |
			| abc000000000000000000001 | nature.com | WCAG2AA  |
		And I have the results:
			"""
			[
				{"_id": "abc000000000000000000003", "task": "abc000000000000000000001", "count": {"error": 1, "warning": 2, "notice": 3, "total": 6}, "results": ["foo"]},
				{"_id": "abc000000000000000000004", "task": "abc000000000000000000002", "count": {"error": 3, "warning": 4, "notice": 5, "total": 12}, "results": ["foo"]}
			]
			"""
		When I GET the "tasks/abc000000000000000000001/results" endpoint with query:
			"""
			{
				"full": "true"
			}
			"""
		Then I should get a 200 response
		And I should see a JSON representation of result "abc000000000000000000003" with full details
		And I should not see a JSON representation of result "abc000000000000000000004"

	Scenario: Get results by task ID with an invalid query string
		Given I have the tasks:
			| _id                      | url        | standard |
			| abc000000000000000000001 | nature.com | WCAG2AA  |
		When I GET the "tasks/abc000000000000000000001/results" endpoint with query:
			"""
			{
				"foo": "bar"
			}
			"""
		Then I should get a 400 response

	Scenario: Get results with a non-existent task ID
		When I GET the "tasks/abc000000000000000000000/results" endpoint
		Then I should get a 404 response

	Scenario: Get results with an invalid task ID
		When I GET the "tasks/abc/results" endpoint
		Then I should get a 404 response

	Scenario: Get results with a non-alphanumeric task ID
		When I GET the "tasks/$$$/results" endpoint
		Then I should get a 400 response
