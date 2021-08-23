const payload = require('../../support/payload');
const { isAnOverbooking } = require('../../../domain');

class CreateEventRoute {
    
    matches(request) {
        return request.method=='POST' && request.url == '/data/events/create';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        try {
            let event = await server.factory.buildEvent(incoming, server.services['resources']);
            let events = await server.services['events'].all();
            if (isAnOverbooking(event, events)) {
                response.statusCode = 403;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:'Overbooking forbidden' }));
            }
            else {
                await server.services['events'].save(event);
                response.statusCode = 201;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ location:'/data/events/' + event.id }));    
            }
        }
        catch (error) {
            response.statusCode = 406;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify({ message:error.message }));
        }
        response.end();
    }
}

module.exports = CreateEventRoute;