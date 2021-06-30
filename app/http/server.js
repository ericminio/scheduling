let http = require('http');
let path = require('path');

class Server {
    constructor(port) {
        this.port = port;
        this.internal = http.createServer(this.route);
    }
    start(done) {
        this.internal.listen(this.port, done);
    }
    stop(done) {
        this.internal.close(done);
    }
    route(request, response) {
        if (request.url == '/ping') {
            response.writeHead(200, { 'content-type':'application/json' })
            response.end(JSON.stringify({alive:true}));
        }
        else {
            response.writeHead(200, { 'content-type':'text/html' })
            response.end(require('fs').readFileSync(
                path.join(__dirname, 'index.html')).toString())
        }
    }
}

module.exports = {
    Server:Server
}