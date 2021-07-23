const fs = require('fs');
const path = require('path');

class DefaultRoute {

    matches(request) {
        return true;
    }
    async go(request, response) {
        response.statusCode = 200;
        response.setHeader('content-type', 'text/html');
        let body = fs.readFileSync(path.join(__dirname, '../../web', 'index.html')).toString();
        response.write(body);
        response.end();
    }
}

module.exports = DefaultRoute;