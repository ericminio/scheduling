@backlog
Feature: Securing data

    Some can read, some can write, some can configure

    Background: brand new system
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

    Scenario: read only
        Given anonymous user can only read
        When I sign in as anonymous
        When I look at the events
        When I inspect event "Alex" scheduled with "GNEA"
        When I try to delete this event
        Then I receive the error message "insufficient privilege"
        
