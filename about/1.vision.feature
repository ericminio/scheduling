Feature: Scheduling events

    Plan the use of any type of resources

    Background: brand new system
        Given the following resources exist in the system
            | Type     | Id   |
            | plane    | GITN |
            | plane    | GNEA |
            | headeset | H1   |
            | headeset | H2   |
            | headeset | H3   |
        Given the following events
            | Id | Start | End   | Resources     |
            | E1 | 11:30 | 13:30 | GITN          |
            | E2 | 15:00 | 18:00 | GITN, H1      |
            | E3 | 18:00 | 20:00 | GNEA , H1, H2 |

    Scenario: Inspect event
        Given I look at the events grouped by "plane"
        Then I see that event "E3" ends at "20:00"

    @backlog
    Scenario: Modify event
        Given I look at the events grouped by "plane"
        When I move event "E3" to start at "18:30"
        Then I see that event "E3" ends at "20:30"
