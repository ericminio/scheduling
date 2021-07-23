let http = require('http');
let path = require('path');
let fs = require('fs');
const payload = require('./support/payload');
const Factory = require('../domain/factory');
const Guard = require('./guard');
const { Ping, Yop, Scripts, Styles, 
        SignIn, 
        GetAllEvents, CreateOneEvent, GetOneEvent, DeleteOneEvent,
        GetAllResources, CreateOneResource, GetOneResource, DeleteOneResource } = require('./routes');

class Server {
    constructor(port) {
        this.port = port;
        this.sockets = [];
        this.factory = new Factory();
        this.internal = http.createServer(async (request, response)=>{
            try {
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, DELETE');
                let isAuthorized = await this.guard.isAuthorized(request);
                if (! isAuthorized) {
                    response.statusCode = 403;
                    let body = JSON.stringify({ message: 'forbidden: insufficient privilege' });
                    response.setHeader('content-type', 'application/json');
                    response.write(body);
                    response.end();
                    return;                    
                }
                if (request.method=='OPTIONS' && request.url.indexOf('/data/')==0) {
                    response.statusCode = 200;
                    return;
                }
                await this.route(request, response);                
            }
            catch (error) {
                console.log(error);
                response.setHeader('content-type', 'text/plain');
                response.statusCode = 500;
                response.write('oops');
                response.end()
            }
        });
        this.services = {};
        this.guard = new Guard();
        this.routes = [ new Ping(), new Yop(), new Scripts(), new Styles(), 
            new SignIn(),
            new GetAllEvents(), new CreateOneEvent(), new GetOneEvent(), new DeleteOneEvent(),
            new GetAllResources(), new CreateOneResource(), new GetOneResource(), new DeleteOneResource()
        ];
    }
    start(done) {
        this.internal.listen(this.port, done);
        this.internal.on('connection', (socket)=> {
            // console.log('socket connected');
            this.sockets.push(socket);
            socket.on('close', ()=> {
                // console.log('socket closed');
                this.sockets.splice(this.sockets.indexOf(socket), 1);
            });
        });
    }
    stop(done) {
        this.sockets.forEach(socket=> socket.destroy())
        this.internal.close(done);
    }
    async route(request, response) {
        let found = false;
        for (let i =0; i<this.routes.length; i++) {
            let route = this.routes[i];
            if (route.matches(request)) {
                await route.go(request, response, this);
                found = true;
                break;
            }
        }
        if (! found) {
            response.statusCode = 200;
            let body = 'NOT FOUND';

            if (request.url.indexOf('/data/')==0) {
                response.statusCode = 501;
            }

            else {
                body = fs.readFileSync(path.join(__dirname, '../web', 'index.html')).toString();
                response.setHeader('content-type', 'text/html');
            }
            // console.log('--> returning', body)
            response.write(body);
            response.end();
        }
    }
}

module.exports = {
    Server:Server
}