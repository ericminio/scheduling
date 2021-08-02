Feature: Scheduling events

    Plan the use of any type of resources

    Background: brand new system
        Given the following users and privileges
            | Username  | Password | Priviledges  |
            | I         | secret   | read, write  |
        Given I create the following resources
            | Type       | Name       |
            | plane      | GITN       |
            | plane      | GNEA       |
            | instructor | Vasile     |
            | instructor | Alain      |
            | instructor | Eddy       |
            | headset    | Headset #1 |
            | headset    | Headset #2 |
            | headset    | Headset #3 |
        Given I create the following events
            | Label | Start            | End              | Resources                    |
            | Bob   | 2015-10-01 11:30 | 2015-10-01 13:30 | GITN, Headset #1, Headset #2 |
            | Joe   | 2015-10-01 15:00 | 2015-10-01 18:00 | GITN, Vasile                 |
            | Alex  | 2015-10-01 18:00 | 2015-10-01 20:00 | GNEA, Alain, Headset #1      |

    Scenario: Inspect events
        When "I" signs in with password "secret"
        When I open the calendar on "2015-10-01"
        Then I see that "Alex" starts at "18:00"
        Then I see that "Alex" ends at "20:00"
        Then I see that "Alex" is scheduled with "GNEA"
        Then I see that "Alex" is scheduled with "Alain"
        Then I see that "Alex" is scheduled with "Headset #1"
        
        When I inspect event "Alex" scheduled with "GNEA"
        Then I see that this event start is "2015-10-01 18:00"
        Then I see that this event end is "2015-10-01 20:00"
        
        When I inspect resource "GNEA"
        Then I see that this resource type is "plane"

    Scenario: empty calendar
        When "I" signs in with password "secret"
        When I open the calendar on "2020-10-01"
        Then I see that the calendar is empty
