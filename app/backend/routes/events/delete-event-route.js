const { DeleteEvent, Event } = require('../../../domain');

class DeleteOneEventRoute {
    constructor() {
        this.deleteEvent = new DeleteEvent();
    }

    matches(request) {
        return request.method=='DELETE' && request.url.indexOf('/data/events/')==0;
    }
    async go(request, response, server) {
        let id = request.url.substring('/data/events/'.length);
        this.deleteEvent.use(server.adapters);
        return this.deleteEvent.please(new Event({ id:id }))
            .then(()=>{
                response.statusCode = 200;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:'Event deleted' }));
            })
            .catch((error)=>{
                response.statusCode = 400;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:error.message }));
            })
            .finally(()=>{
                response.end();
            });
    }
}

module.exports = DeleteOneEventRoute;