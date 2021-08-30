let http = require('http');

class Server {
    constructor(port) {
        this.port = port;
        this.sockets = [];
        this.internal = http.createServer(async (request, response)=>{
            try {
                await this.route(request, response);                
            }
            catch (error) {
                new ErrorRoute(error).go(response);                
            }
        });
        this.routes = [];
    }
    start(done) {
        this.internal.on('connection', (socket)=> {
            this.sockets.push(socket);
            socket.on('close', ()=> {
                this.sockets.splice(this.sockets.indexOf(socket), 1);
            });
        });
        this.internal.listen(this.port, done);
    }
    stop(done) {
        this.sockets.forEach(socket=> socket.destroy())
        this.internal.close(done);
    }
    async route(request, response) {
        let found = false;
        for (let i =0; i<this.routes.length; i++) {
            let route = this.routes[i];
            let matching = await route.matches(request, this);
            if (matching) {
                found = true;
                await route.go(request, response, this);
                break;
            }
        }
        if (! found) {
            response.statusCode = 404;
            response.setHeader('content-type', 'text/plain');
            response.write('NOT FOUND');
            response.end();
        }
    }
}

module.exports = {
    Server:Server
}