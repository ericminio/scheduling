const { code, codes } = require('../utils/files');

module.exports = {
    Resource: code('/domain/calendar/resource.js', 'Resource'),
    Event: code('/domain/calendar/event.js', 'Event'),
    EventFactoryValidatingFields: code('/domain/calendar/event-factory.js', 'EventFactoryValidatingFields'),
    User: code('/domain/user/user.js', 'User'),
    Configuration: code('/domain/configuration/configuration.js', 'Configuration'),
    isValidDate: code('/domain/calendar/is-valid-date.js', 'isValidDate'),
    isValidDatetime: code('/domain/calendar/is-valid-datetime.js', 'isValidDatetime'),
    nextDay: code('/domain/calendar/time.js', 'nextDay'),
    previousDay: code('/domain/calendar/time.js', 'previousDay'),
    isAnOverbooking: code('/domain/calendar/overbooking.js', 'isAnOverbooking'),
    formatDate: code('/domain/calendar/time.js', 'formatDate'),

    EventFactoryValidatingFieldsWithDependencies: codes([
        '/domain/calendar/is-valid-label.js',
        '/domain/calendar/is-valid-datetime.js',
        '/domain/calendar/event.js',
        '/domain/calendar/event-factory.js'
    ], 'EventFactoryValidatingFields')

}