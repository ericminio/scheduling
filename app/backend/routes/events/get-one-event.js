class GetOneEventRoute {

    matches(request) {
        return request.method=='GET' && request.url.indexOf('/data/events/')==0;
    }
    async go(request, response, server) {
        let id = request.url.substring('/data/events/'.length);
        let instance = await server.services['events'].get(id);
        if (instance) {
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify(instance));
        } else {
            response.statusCode = 404;
            response.setHeader('content-type', 'text/plain');
            response.write('NOT FOUND');
        }
        response.end();
    }
}

module.exports = GetOneEventRoute;