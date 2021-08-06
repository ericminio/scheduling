const fs = require('fs');
const path = require('path');
const code = (filename)=> fs.readFileSync(path.join(__dirname, filename)).toString()
const concat = (files)=> files.reduce((acc, filename)=> acc += code(filename), '');

module.exports = {
    yop: require('./yop'),
    domain: concat([
        '../domain/configuration.js'
    ]),
    data: concat([
        './data/api-client.js',
        './data/data-reader.js'
    ]),
    components: concat([
        './components/system-status.js',
        './components/header.js',
        './components/layout.js',
        './components/resource-renderer.js',
        './components/timeline-marker.js',
        './components/calendar-event.js',
        './components/calendar.js',
        './components/resource-creation.js',
        './components/event-creation.js',
        './components/show-event.js',
        './components/show-resource.js',
        './components/error-message.js',
        './components/logout.js',
        './components/page-sign-in.js',
        './components/page-events.js',
        './components/page-configuration.js',
        './components/menu.js',
        './components/success-message.js' 
    ])
}