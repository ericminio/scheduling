Feature: List of future events

    Background: Resto with tables
        Given the following users and privileges
            | Username    | Password | Privileges              |
            | Max         | secret   | read, write, configure  |
        Given "Max" signs in with password "secret"
        Given he navigates to calendar
        Given he creates the following resources 
            | Type       | Name      |
            | table      | table #1  |
            | table      | table #2  |
            | table      | table #3  |
    @only
    Scenario: Displays future events
        Given he navigates to calendar
        Given he creates the following events
            | Label        | Start             | End              | Resources     |
            | Birthday 15  | 2015-09-21 13:00  | 2015-09-21 17:00 | table #1      |
            | Birthday 21  | 2021-09-21 13:00  | 2021-09-21 17:00 | table #1      |
        Given today is "2015-09-20"
        Given he opens the coming-up page 
        Then he sees that day "2015-09-21" has event "Birthday 15"
        Then he sees that day "2021-09-21" has event "Birthday 21"
