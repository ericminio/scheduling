Feature: Bookings

    Time is a resource

    Background: brand new system
        Given the following users and privileges
            | Username    | Password | Priviledges  |
            | Max         | secret   | read, write, configure  |

    
    Scenario: Creating time
        Given "Max" signs in with password "secret"
        Given he creates the following resources 
            | Type      | Name            |
            | date      | 10-01 table #1  |
            | date      | 10-01 table #2  |
            | date      | 12-31 table #1  |
            | date      | 12-31 table #2  |
        Given he navigates to configuration
        Given he modifies the title to "Bo Resto"
        Given he modifies the opening hours to "11-24"
        Given he navigates to calendar
        Given he creates the following events
            | Label          | Start    | End     | Resources                       |
            | Joe birthday   | 19:30    | 23:00   | 10-01 table #1, 10-01 table #2  |
        Given he creates the following resources 
            | Type      | Name            |
            | date      | 09-21 table #1  |
        Then he sees that the resources are ordered as follows
            | 09-21 table #1  |
            | 10-01 table #1  |
            | 10-01 table #2  |
            | 12-31 table #1  |
            | 12-31 table #2  |
