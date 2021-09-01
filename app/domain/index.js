const { code, codes, contents } = require('../utils/files');

module.exports = {
    Resource: code('/domain/calendar/resource.js', 'Resource'),
    ResourceFactory: code('/domain/calendar/resource-factory.js', 'ResourceFactory'),
    Event: code('/domain/calendar/event.js', 'Event'),
    EventFactoryValidatingFields: code('/domain/calendar/event-factory-validating-fields.js', 'EventFactoryValidatingFields'),
    EventFactoryValidatingNeighbours: code('/domain/calendar/event-factory-validating-neighbours.js', 'EventFactoryValidatingNeighbours'),
    User: code('/domain/user/user.js', 'User'),
    Configuration: code('/domain/configuration/configuration.js', 'Configuration'),
    isValidDate: code('/domain/calendar/is-valid-date.js', 'isValidDate'),
    isValidDatetime: code('/domain/calendar/is-valid-datetime.js', 'isValidDatetime'),
    nextDay: code('/domain/calendar/time.js', 'nextDay'),
    previousDay: code('/domain/calendar/time.js', 'previousDay'),
    isAnOverbooking: code('/domain/calendar/is-overbooking.js', 'isAnOverbooking'),
    formatDate: code('/domain/calendar/time.js', 'formatDate'),

    SearchEvents: code('/domain/calendar/search-events.js', 'SearchEvents'),
    CreateEvent: code('/domain/calendar/create-event.js', 'CreateEvent'),
    CreateEventWithDependencies: codes([
        '/domain/calendar/is-valid-label.js',
        '/domain/calendar/is-valid-datetime.js',
        '/domain/calendar/is-overbooking.js',
        '/domain/calendar/event.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event-factory-validating-fields.js',
        '/domain/calendar/event-factory-validating-neighbours.js',
        '/domain/calendar/create-event.js'
    ], 'CreateEvent'),
    DeleteEvent: code('/domain/calendar/delete-event.js', 'DeleteEvent'),

    CreateResource: code('/domain/calendar/create-resource.js', 'CreateResource'),
    CreateResourceWithDependencies: codes([
        '/domain/calendar/resource.js',
        '/domain/calendar/resource-factory.js',
        '/domain/calendar/create-resource.js'
    ], 'CreateResource'),

    EventFactoryValidatingFieldsWithDependencies: codes([
        '/domain/calendar/is-valid-label.js',
        '/domain/calendar/is-valid-datetime.js',
        '/domain/calendar/event.js',
        '/domain/calendar/event-factory-validating-fields.js'
    ], 'EventFactoryValidatingFields'),
    EventFactoryValidatingNeighboursWithDependencies: codes([
        '/domain/calendar/is-valid-label.js',
        '/domain/calendar/is-valid-datetime.js',
        '/domain/calendar/is-overbooking.js',
        '/domain/calendar/event.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event-factory-validating-fields.js',
        '/domain/calendar/event-factory-validating-neighbours.js',
    ], 'EventFactoryValidatingNeighbours'),
    ResourceFactoryWithDependencies: codes([
        '/domain/calendar/resource.js',
        '/domain/calendar/resource-factory.js'
    ], 'ResourceFactory'),
    DeleteResource: code('/domain/calendar/delete-resource.js', 'DeleteResource'),

    domain: contents([
        '/domain/configuration/configuration.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event.js',
        '/domain/calendar/time.js',
        '/domain/calendar/is-valid-date.js',
        '/domain/calendar/is-valid-datetime.js',
        '/domain/calendar/is-valid-label.js',
        '/domain/calendar/event-factory-validating-fields.js',
        '/domain/calendar/create-event.js',
        '/domain/calendar/delete-event.js',
        '/domain/calendar/search-events.js',
        '/domain/calendar/resource-factory.js',
        '/domain/calendar/create-resource.js',
        '/domain/calendar/delete-resource.js'
    ])
}