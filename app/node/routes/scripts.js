const fs = require('fs');
const path = require('path');

class ScriptsRoute {
    constructor() {
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
        this.body = ''
            + this.read('../../domain', 'configuration.js')
            + this.read('../../web/data', 'api-client.js')
            + this.read('../../web/data', 'data-reader.js')
            ;
        files.forEach((file)=> {
            this.body += this.read('../../web/components', file);
        });
    }
    read(folder, filename) {
        return fs.readFileSync(path.join(__dirname, folder, filename)).toString();
    }

    matches(request) {
        return request.url == '/scheduling.js';
    }
    async go(request, response) { 
        response.statusCode = 200;
        response.setHeader('content-type', 'application/javascript');
        response.write(this.body);
        response.end();
    }
}

module.exports = ScriptsRoute;