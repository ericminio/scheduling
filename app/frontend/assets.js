const { contents } = require('../utils/files');

module.exports = {
    yop: require('./yop'),
    domain: contents([
        '/domain/configuration/configuration.js',
        '/domain/calendar/resource.js',
        '/domain/calendar/event.js',
        '/domain/calendar/time.js',
        '/domain/calendar/is-valid-date.js',
        '/domain/calendar/is-valid-datetime.js',
        '/domain/calendar/is-valid-label.js',
        '/domain/calendar/event-factory.js'
    ]),
    data: contents([
        '/frontend/data/api-client.js',
        '/frontend/data/configuration-reader.js',
        '/frontend/data/resources-reader.js',
        '/frontend/data/events-reader.js',
        '/frontend/data/facade.js'
    ]),
    components: contents([
        '/frontend/calendar/timeline/timeline-marker.js',
        '/frontend/calendar/timeline/timeline.js',
        '/frontend/calendar/search/day-selection.js',
        '/frontend/calendar/layout.js',
        '/frontend/calendar/resource-renderer.js',
        '/frontend/calendar/calendar-event.js',
        '/frontend/calendar/calendar.js',
        '/frontend/calendar/events/events-repository-using-http.js',
        '/frontend/calendar/events/event-creation.js',
        '/frontend/calendar/page-calendar-day.js',
        '/frontend/calendar/resource-creation.js',
        '/frontend/calendar/show-event.js',
        '/frontend/calendar/show-resource.js',
        '/frontend/common/error-message.js',
        '/frontend/common/header.js',
        '/frontend/common/menu.js',
        '/frontend/common/success-message.js',
        '/frontend/common/system-status.js',
        '/frontend/configuration/page-configuration.js',
        '/frontend/users/logout.js',
        '/frontend/users/page-sign-in.js'
    ])
}