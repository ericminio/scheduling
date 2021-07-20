@only
Feature: Securing data

    Some can read, some can write, some can configure

    Background: brand new system
        Given I create the following resources
            | Type       | Name       |
            | plane      | GITN       |
            | plane      | GNEA       |
        Given I create the following events
            | Label | Start            | End              | Resources |
            | Alex  | 2015-10-01 18:00 | 2015-10-01 20:00 | GNEA      |

    Scenario: read only
        Given anonymous user can only read
        When I sign in as anonymous
        When I look at the events
        When I inspect event "Alex" scheduled with "GNEA"
        When I try to delete this event
        Then I receive the error message "insufficient privilege"
        
