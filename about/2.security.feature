Feature: Securing data

    Some can read, some can write, some can configure

    Background:
        Given the following users and privileges
            | Username  | Password | Priviledges  |
            | I         | secret   | read, write  |
            | Joe       | secret   | read         |
        Given I create the following resources
            | Type         | Name           |
            | bicycle      | blue bicycle   |
            | bicycle      | white bicycle  |
            | helmet       | helmet #1      |
        Given I create the following events
            | Label | Start            | End              | Resources                |
            | Alex  | 2015-10-01 08:00 | 2015-10-01 20:00 | blue bicycle, helmet #1  |

    Scenario: read only
        When "Joe" signs in with password "secret"
        When he inspects event "Alex" scheduled with "blue bicycle"
        When he tries to delete this event
        Then he receives the error message "forbidden: insufficient privilege"
        
