class DeleteAllEventsRoute {

    matches(request) {
        return request.method=='DELETE' && request.url == '/data/events';
    }
    async go(request, response, server) {
        await server.services['events'].truncate();
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ message:'events deleted' }));
        response.end();
    }
}

module.exports = DeleteAllEventsRoute;