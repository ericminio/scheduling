Feature: Securing data

    Some can read, some can write

    Background:
        Given the following users and privileges
            | Username  | Password | Privileges   |
            | I         | secret   | read, write  |
            | Joe       | secret   | read         |
            | Max       | secret   | read, write  |
        Given "I" signs in with password "secret"        
        Given I create the following resources
            | Type         | Name           |
            | bicycle      | blue bicycle   |
            | bicycle      | white bicycle  |
            | helmet       | helmet #1      |
        Given I open the calendar on "2015-10-01"
        Given I create the following events
            | Label | Start            | End              | Resources                |
            | Alex  | 2015-10-01 08:00 | 2015-10-01 20:00 | blue bicycle, helmet #1  |

    Scenario: invalid credentials
        When "Joe" signs in with password "invalid"
        Then he receives the error message "invalid credentials"

    Scenario: delete forbidden
        When "Joe" signs in with password "secret"
        When he opens the calendar on "2015-10-01"
        When he inspects event "Alex" scheduled with "blue bicycle"
        When he tries to delete this event
        Then he receives the error message "forbidden: insufficient privilege"
    
    Scenario: delete of resource forbidden
        When "Joe" signs in with password "secret"
        When he opens the calendar on "2015-10-01"
        When he inspects resource "helmet #1"
        When he tries to delete this resource
        Then he receives the error message "forbidden: insufficient privilege"
    
    Scenario: delete authorized
        When "Max" signs in with password "secret"
        When he opens the calendar on "2015-10-01"
        When he inspects event "Alex" scheduled with "blue bicycle"
        When he tries to delete this event
        Then he sees that the calendar is empty
    
    Scenario: delete of resource authorized
        When "Max" signs in with password "secret"
        When he opens the calendar on "2015-10-01"
        When he inspects resource "helmet #1"
        When he tries to delete this resource
        Then he sees that the resources are 
            | Name           |
            | blue bicycle   |
            | white bicycle  |
        Then he sees that "Alex" is scheduled with "blue bicycle"