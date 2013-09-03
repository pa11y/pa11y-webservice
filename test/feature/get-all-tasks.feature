
Feature: GET /tasks

	Scenario: Get all tasks
		Given I have the tasks:
			| url 		      	  | standard |
			| nature.com      	  | WCAG2A   |
			| nature.com/register | WCAG2AAA |
			| nature.com/news 	  | WCAG2AA  |
			| nature.com      	  | WCAG2AAA |
			| nature.com      	  | WCAG2AA  |
		When I GET the "tasks" endpoint
		Then I should get a 200 response
		And I should see a JSON representation of all tasks sorted by URL/standard
