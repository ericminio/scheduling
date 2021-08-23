const payload = require('../../support/payload');
const Factory = require('../../factory');
const NextUuid = require('../../storage/next-uuid');

class CreateEventRoute {
    constructor() {
        this.eventFactory = new Factory();
        this.eventFactory.idGenerator = new NextUuid();
    }
    
    matches(request) {
        return request.method=='POST' && request.url == '/data/events/create';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        this.eventFactory.resourcesRepository = server.services['resources'];
        this.eventFactory.eventsRepository = server.services['events'];
        this.eventFactory.buildEvent(incoming)
            .then(async (event)=>{
                await server.services['events'].save(event);
                return event;
            })
            .then(async (event)=>{
                response.statusCode = 201;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ location:'/data/events/' + event.id }));                
            })
            .catch((error)=> {
                response.statusCode = 400;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:error.message }));
            })
            .finally(()=>{ response.end(); });
    }
}

module.exports = CreateEventRoute;