Feature: Week view

    Background: brand new system
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
              
    Scenario: Display several days
        Given he creates the following events
            | Label      | Start                | End                | Resources  |
            | Birthday   | 2021-09-21 13:00     | 2021-09-21 21:00   | table #1   |
        When he opens the week view on "2021-09-21"
        Then he sees that "Birthday" takes place on "Tuesday"
    
        
        