const payload = require('../../support/payload');
const { CreateEventWithDependencies } = require('../../../domain');

class CreateEventRoute {
    constructor() {
        this.createEvent = new CreateEventWithDependencies();
    }
    
    matches(request) {
        return request.method=='POST' && request.url == '/data/events/create';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        this.createEvent.use(server.services);
        this.createEvent.please(incoming)
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