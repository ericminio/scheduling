Feature: Scheduling events

    Plan the use of any type of resources

    Background: brand new system
        Given the following resources exist in the system
            | Id | Type     | Name |
            | R1 | plane    | GITN |
            | R2 | plane    | GNEA |
            | R3 | headeset | H1   |
            | R4 | headeset | H2   |
            | R5 | headeset | H3   |
        Given the following events
            | Id | Start | End   | Resources     |
            | E1 | 11:30 | 13:30 | GITN          |
            | E2 | 15:00 | 18:00 | GITN, H1      |
            | E3 | 18:00 | 20:00 | GNEA , H1, H2 |

    Scenario: Inspect event
        Given I look at the events grouped by "plane"
        Then I see that event "E3" starts at "18:00"
        Then I see that event "E3" ends at "20:00"
        Then I see that event "E3" belongs to "R2"

    @backlog
    Scenario: Modify event
        Given I look at the events grouped by "plane"
        When I move event "E3" to start at "18:30"
        Then I see that event "E3" ends at "20:30"
