Feature: Bookings

    Say you have a restaurant, with 7 tables

    Background: brand new system
        Given the following users and privileges
            | Username    | Password | Privileges              |
            | Max         | secret   | read, write, configure  |
                    
    Scenario: Taking reservation
        Given "Max" signs in with password "secret"
        Given he navigates to configuration
        Given he modifies the title to "Bo Resto"
        Given he modifies the opening hours to "11-24"
        Given he opens the calendar on "2015-09-21"
        Given he creates the following resources 
            | Type       | Name      |
            | table      | table #1  |
            | table      | table #2  |
            | table      | table #3  |
            | table      | table #4  |
            | table      | table #5  |
            | table      | table #6  |
            | table      | table #7  |
        Given he creates the following events
            | Label      | Start               | End                | Resources           |
            | Birthday   | 2015-09-21 1:00     | 2015-09-21 21:00   | table #1, table #2  |
        Then he receives the error message "Invalid date. Expected format is yyyy-mm-dd"
        Given he acknowledges the error message
        Given he creates the following events
            | Label      | Start                | End                | Resources           |
            | Birthday   | 2015-09-21 13:00     | 2015-09-21 21:00   | table #1, table #2  |
        Then he sees that "Birthday" starts at "13:00"
        
        When he navigates to the next day
        Then I see that the calendar is empty