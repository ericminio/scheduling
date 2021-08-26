let http = require('http');
const { EventFactoryValidatingNeighboursWithDependencies, ResourceFactoryWithDependencies } = require('../domain');
const NextUuid = require('./storage/next-uuid');
const Guard = require('./guard');
const { SecurityRoute,
        Yop, Scripts, Styles, 
        Ping, GetConfiguration, UpdateConfiguration,
        SignIn, 
        SearchEventsRoute, GetAllEvents, CreateEventRoute, GetOneEvent, DeleteOneEvent, DeleteAllEventsRoute,
        GetAllResources, CreateOneResource, GetOneResource, DeleteOneResource,
        NotImplemented, DefaultRoute, ErrorRoute } = require('./routes');

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
        this.factory = new EventFactoryValidatingNeighboursWithDependencies();
        this.factory.idGenerator = new NextUuid();
        this.resourceFactory = new ResourceFactoryWithDependencies();
        this.resourceFactory.idGenerator = new NextUuid();
        this.services = {};
        this.guard = new Guard();
        this.routes = [ 
            new SecurityRoute(),
            new Yop(), new Scripts(), new Styles(), 
            new Ping(), new GetConfiguration(), new UpdateConfiguration(),
            new SignIn(),
            new SearchEventsRoute(), new GetAllEvents(), new CreateEventRoute(), new GetOneEvent(), new DeleteOneEvent(), new DeleteAllEventsRoute(),
            new GetAllResources(), new CreateOneResource(), new GetOneResource(), new DeleteOneResource(),
            new NotImplemented(),
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