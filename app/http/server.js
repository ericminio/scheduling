let http = require('http');
let path = require('path');
let fs = require('fs');

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
        else if (request.url == '/calendar.js') {
            response.writeHead(200, { 'content-type':'application/javascript' })
            response.end(fs.readFileSync(
                path.join(__dirname, 'js', 'calendar.js')).toString())
        }
        else if (request.url == '/scheduling.css') {
            response.writeHead(200, { 'content-type':'text/css' })
            response.end(fs.readFileSync(
                path.join(__dirname, 'css', 'scheduling.css')).toString())
        }
        else {
            response.writeHead(200, { 'content-type':'text/html' })
            response.end(fs.readFileSync(
                path.join(__dirname, 'index.html')).toString())
        }
    }
}

module.exports = {
    Server:Server
}