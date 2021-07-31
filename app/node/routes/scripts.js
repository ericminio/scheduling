const fs = require('fs');
const path = require('path');

class ScriptsRoute {

    matches(request) {
        return request.url == '/scheduling.js';
    }
    async go(request, response) {
        let files = [
            'system-status.js',
            'header.js',
            'layout.js',
            'resource.js',
            'timeline-marker.js',
            'calendar-event.js',
            'calendar.js',
            'resource-creation.js',
            'event-creation.js',
            'show-event.js',
            'show-resource.js',
            'error-message.js',
            'logout.js',
            'page-sign-in.js',
            'page-events.js',
            'page-configuration.js',
            'menu.js',
            'success-message.js'   
        ];
        let body = fs.readFileSync(path.join(__dirname, '../../web/data', 'api-client.js')).toString();
        files.forEach((file)=> {
            body += fs.readFileSync(path.join(__dirname, '../../web/components', file)).toString();
        })
        response.statusCode = 200;
        response.setHeader('content-type', 'application/javascript');
        response.write(body);
        response.end();
    }
}

module.exports = ScriptsRoute;