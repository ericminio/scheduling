let http = require('http');
const Factory = require('../domain/factory');
const Guard = require('./guard');
const { SecurityRoute,
        Ping, Yop, Scripts, Styles, 
        SignIn, 
        GetAllEvents, CreateOneEvent, GetOneEvent, DeleteOneEvent,
        GetAllResources, CreateOneResource, GetOneResource, DeleteOneResource,
        DefaultRoute } = require('./routes');

class Server {
    constructor(port) {
        this.port = port;
        this.sockets = [];
        this.factory = new Factory();
        this.internal = http.createServer(async (request, response)=>{
            try {
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, DELETE');
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
        this.routes = [ 
            new SecurityRoute(),
            new Ping(), new Yop(), new Scripts(), new Styles(), 
            new SignIn(),
            new GetAllEvents(), new CreateOneEvent(), new GetOneEvent(), new DeleteOneEvent(),
            new GetAllResources(), new CreateOneResource(), new GetOneResource(), new DeleteOneResource(),
            new DefaultRoute()
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
        for (let i =0; i<this.routes.length; i++) {
            let route = this.routes[i];
            let matching = await route.matches(request, this);
            if (matching) {
                await route.go(request, response, this);
                break;
            }
        }
    }
}

module.exports = {
    Server:Server
}