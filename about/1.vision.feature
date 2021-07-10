Feature: Scheduling events

    Plan the use of any type of resources

    Background: brand new system
        Given the following resources exist in the system
            | Id | Type       | Name       |
            | R1 | plane      | GITN       |
            | R2 | plane      | GNEA       |
            | R3 | instructor | Vasile     |
            | R4 | instructor | Alain      |
            | R5 | instructor | Eddy       |
            | R6 | headset    | Headset #1 |
            | R7 | headset    | Headset #2 |
            | R8 | headset    | Headset #3 |
        Given the following events
            | Id | Start | End   | Resources                    | Label |
            | E1 | 11:30 | 13:30 | GITN, Headset #1, Headset #2 | Bob   |
            | E2 | 15:00 | 18:00 | GITN, Vasile                 | Joe   |
            | E3 | 18:00 | 20:00 | GNEA, Alain, Headset #1      | Alex  |

    Scenario: Inspect event
        Given I look at the events scheduled with "GITN, GNEA, Vasile, H1, H2, H3"
        Then I see that "Alex" starts at "18:00"
        Then I see that "Alex" ends at "20:00"
        Then I see that "Alex" is scheduled with "GNEA"
        Then I see that "Alex" is scheduled with "Alain"
        Then I see that "Alex" is scheduled with "Headset #1"

    @backlog
    Scenario: Modify event
        Given I look at the events grouped by "plane"
        When I move event "E3" to start at "18:30"
        Then I see that event "E3" ends at "20:30"
