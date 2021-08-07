Feature: Configuration

    Some can configure

    Background:
        Given the following users and privileges
            | Username  | Password | Privileges              |
            | Joe       | secret   | read, write             |
            | Max       | secret   | read, write, configure  |
    
    Scenario: change title
        When "Max" signs in with password "secret"
        When he navigates to configuration
        When he modifies the title to "The world of Max"
        Then he sees that the header displays "The world of Max"

    Scenario: change opening hours
        When "Max" signs in with password "secret"
        When he navigates to configuration
        When he modifies the opening hours to "8-21"
        When he navigates to calendar
        Then he sees that the first timeline marker is "8"
        Then he sees that the last timeline marker is "20"

    Scenario: change configuration forbidden
        When "Joe" signs in with password "secret"
        When he navigates to configuration
        When he modifies the opening hours to "18-21"
        Then he receives the error message "forbidden: insufficient privilege"
