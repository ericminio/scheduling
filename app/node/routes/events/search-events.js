class SearchEventsRoute {
    constructor() {
        this.prefix = '/data/events?date=';
    }
    matches(request) {
        return request.method=='GET' && request.url.indexOf(this.prefix) == 0;
    }
    parse(request) {
        let date = request.url.substring(this.prefix.length);
        return date;
    }
    async go(request, response, server) {
        let date = this.parse(request);
        let events = server.services['events'];
        let all = await events.search(date);
        
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ events:all }));
        response.end();
    }
}

module.exports = SearchEventsRoute;