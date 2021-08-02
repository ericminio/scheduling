const fs = require('fs');
const path = require('path');

class NotImplemented {

    matches(request) {
        return request.url.indexOf('/data/') == 0;
    }
    async go(request, response) {
        response.statusCode = 501;
        response.setHeader('content-type', 'text/plain');
        response.write('NOT IMPLEMENTED');
        response.end();
    }
}

module.exports = NotImplemented;