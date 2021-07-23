class DeleteOneEventRoute {

    matches(request) {
        return request.method=='DELETE' && request.url.indexOf('/data/events/')==0;
    }
    async go(request, response, server) {
        let id = request.url.substring('/data/events/'.length);
        let instance = await server.services['events'].get(id);
        if (instance) {
            await server.services['events'].delete(id);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify({ message:'event deleted' }));
        } else {
            response.statusCode = 404;
            response.setHeader('content-type', 'text/plain');
            response.write('NOT FOUND');
        }
        response.end();
    }
}

module.exports = DeleteOneEventRoute;