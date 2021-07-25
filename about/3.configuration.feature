Feature: Configuration

    Some can configure

    Background:
        Given the following users and privileges
            | Username  | Password | Priviledges             |
            | Joe       | secret   | read, write             |
            | Max       | secret   | read, write, configure  |
    
    @only
    Scenario: change title
        When "Max" signs in with password "secret"
        When he navigates to configuration
        When he modifies the title to "The world of Max"
        Then he sees that the header displays "The world of Max"
