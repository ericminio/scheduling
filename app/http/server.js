let http = require('http');
let path = require('path');

class Server {
    constructor(port) {
        this.port = port;
        this.internal = http.createServer(this.route);
    }
    start() {
        this.internal.listen(this.port);
    }
    route(request, response) {
        response.writeHead(200, { 'content-type':'text/html' })
        response.end(require('fs').readFileSync(
            path.join(__dirname, 'index.html')).toString())
    }
}

module.exports = {
    Server:Server
}