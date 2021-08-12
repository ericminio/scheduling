class GetAllEventsRoute {
    
    matches(request) {
        return request.method=='GET' && request.url == '/data/events';
    }
    async go(request, response, server) {
        let events = server.services['events'];
        let all = await events.all();
        
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ events:all }));
        response.end();
    }
}

module.exports = GetAllEventsRoute;