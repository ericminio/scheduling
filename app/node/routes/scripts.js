const { domain, data, components } = require('../../web/assets');

class ScriptsRoute {
    constructor() {
        this.body = ''
            + domain
            + data
            + components
            ;
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