const { code, codes, contents } = require('../utils/files');

module.exports = {
    Resource: code('/domain/calendar/resource.js', 'Resource'),
    ResourceFactory: code('/domain/calendar/resource-factory.js', 'ResourceFactory'),
    Event: code('/domain/calendar/event.js', 'Event'),
    EventFactoryValidatingFields: code('/domain/calendar/event-factory-validating-fields.js', 'EventFactoryValidatingFields'),
    EventFactoryValidatingNeighbours: code('/domain/calendar/event-factory-validating-neighbours.js', 'EventFactoryValidatingNeighbours'),
    User: code('/domain/user/user.js', 'User'),
    Configuration: code('/domain/configuration/configuration.js', 'Configuration'),
    isValidDate: code('/domain/rules/is-valid-date.js', 'isValidDate'),
    isValidDatetime: code('/domain/rules/is-valid-datetime.js', 'isValidDatetime'),
    nextDay: code('/domain/calendar/time.js', 'nextDay'),
    previousDay: code('/domain/calendar/time.js', 'previousDay'),
    isAnOverbooking: code('/domain/rules/is-overbooking.js', 'isAnOverbooking'),
    formatDate: code('/domain/calendar/time.js', 'formatDate'),

    SearchEvents: code('/domain/services/search-events.js', 'SearchEvents'),
    CreateEvent: code('/domain/services/create-event.js', 'CreateEvent'),
    CreateEventWithDependencies: codes([
        '/domain/rules/is-valid-label.js',
        '/domain/rules/is-valid-datetime.js',
        '/domain/rules/is-overbooking.js',
        '/domain/calendar/event.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event-factory-validating-fields.js',
        '/domain/calendar/event-factory-validating-neighbours.js',
        '/domain/services/create-event.js'
    ], 'CreateEvent'),
    DeleteEvent: code('/domain/services/delete-event.js', 'DeleteEvent'),

    CreateResource: code('/domain/services/create-resource.js', 'CreateResource'),
    CreateResourceWithDependencies: codes([
        '/domain/calendar/resource.js',
        '/domain/calendar/resource-factory.js',
        '/domain/services/create-resource.js'
    ], 'CreateResource'),

    EventFactoryValidatingFieldsWithDependencies: codes([
        '/domain/rules/is-valid-label.js',
        '/domain/rules/is-valid-datetime.js',
        '/domain/calendar/event.js',
        '/domain/calendar/event-factory-validating-fields.js'
    ], 'EventFactoryValidatingFields'),
    EventFactoryValidatingNeighboursWithDependencies: codes([
        '/domain/rules/is-valid-label.js',
        '/domain/rules/is-valid-datetime.js',
        '/domain/rules/is-overbooking.js',
        '/domain/calendar/event.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event-factory-validating-fields.js',
        '/domain/calendar/event-factory-validating-neighbours.js',
    ], 'EventFactoryValidatingNeighbours'),
    ResourceFactoryWithDependencies: codes([
        '/domain/calendar/resource.js',
        '/domain/calendar/resource-factory.js'
    ], 'ResourceFactory'),
    DeleteResource: code('/domain/services/delete-resource.js', 'DeleteResource'),
    GetResources: code('/domain/services/get-resources.js', 'GetResources'),

    domain: contents([
        '/domain/configuration/configuration.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event.js',
        '/domain/calendar/time.js',
        '/domain/rules/is-valid-date.js',
        '/domain/rules/is-valid-datetime.js',
        '/domain/rules/is-valid-label.js',
        '/domain/calendar/event-factory-validating-fields.js',
        '/domain/services/create-event.js',
        '/domain/services/delete-event.js',
        '/domain/services/search-events.js',
        '/domain/calendar/resource-factory.js',
        '/domain/services/create-resource.js',
        '/domain/services/delete-resource.js',
        '/domain/services/get-resources.js'
    ])
}