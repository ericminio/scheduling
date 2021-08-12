const fs = require('fs');
const path = require('path');

class StylesRoute {

    matches(request) {
        return request.url == '/scheduling.css';
    }
    async go(request, response) {
        let body = fs.readFileSync(path.join(__dirname, '../../frontend', 'scheduling.css')).toString();                
        response.statusCode = 200;
        response.setHeader('content-type', 'text/css');
        response.write(body);
        response.end();
    }
}

module.exports = StylesRoute;