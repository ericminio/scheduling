const { contents } = require('../../yop/utils/files');
const { domain } = require('../domain')

module.exports = {
    yop: require('../../yop/web'),
    domain: domain,
    data: contents([
        '/frontend/data/api-client.js',
        '/frontend/data/configuration-reader.js',
        '/frontend/data/facade.js'
    ]),
    components: contents([
        '/frontend/calendar/resources/resource-create-using-http.js',
        '/frontend/calendar/resources/resource-creation-trigger.js',
        '/frontend/calendar/resources/resource-creation-form.js',
        '/frontend/calendar/resources/delete-resource-using-http.js',
        '/frontend/calendar/resources/get-resources-using-http.js',
        '/frontend/calendar/timeline/timeline-marker.js',
        '/frontend/calendar/timeline/timeline.js',
        '/frontend/calendar/search/day-selection.js',
        '/frontend/calendar/events/event-create-using-http.js',
        '/frontend/calendar/events/event-creation.js',
        '/frontend/calendar/events/event-delete-using-http.js',
        '/frontend/calendar/events/events-search-using-http.js',
        '/frontend/calendar/layout.js',
        '/frontend/calendar/resource-renderer.js',
        '/frontend/calendar/calendar-event.js',
        '/frontend/calendar/calendar.js',
        '/frontend/calendar/show-event.js',
        '/frontend/calendar/show-resource.js',
        '/frontend/calendar/page-calendar-day.js',
        '/frontend/coming-up/page-coming-up.js',
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