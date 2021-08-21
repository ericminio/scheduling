const fs = require('fs');
const path = require('path');
const code = (filename)=> fs.readFileSync(path.join(__dirname, filename)).toString()
const concat = (files)=> files.reduce((acc, filename)=> acc += code(filename), '');

module.exports = {
    yop: require('./yop'),
    domain: concat([
        '../domain/configuration/configuration.js',
        '../domain/calendar/resource.js',
        '../domain/calendar/event.js',
        '../domain/calendar/time.js',
        '../domain/calendar/is-valid-date.js',
        '../domain/calendar/is-valid-datetime.js',
        '../domain/calendar/is-valid-label.js',
        '../domain/calendar/event-factory.js'
    ]),
    data: concat([
        './data/api-client.js',
        './data/configuration-reader.js',
        './data/resources-reader.js',
        './data/events-reader.js',
        './data/facade.js'
    ]),
    components: concat([
        './calendar/timeline/timeline-marker.js',
        './calendar/timeline/timeline.js',
        './calendar/search/day-selection.js',
        './calendar/layout.js',
        './calendar/resource-renderer.js',
        './calendar/calendar-event.js',
        './calendar/calendar.js',
        './calendar/event-creation.js',
        './calendar/page-calendar-day.js',
        './calendar/resource-creation.js',
        './calendar/show-event.js',
        './calendar/show-resource.js',
        './common/error-message.js',
        './common/header.js',
        './common/menu.js',
        './common/success-message.js',
        './common/system-status.js',
        './configuration/page-configuration.js',
        './users/logout.js',
        './users/page-sign-in.js'
    ])
}