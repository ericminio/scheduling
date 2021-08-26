const { nextDay, formatDate } = require('../../../domain');

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
        let start = `${this.parse(request)} 00:00:00`;
        let end = `${formatDate(nextDay(start))} 00:00:00`;
        let events = await server.adapters.searchEvents.inRange(start, end);
        
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ events:events }));
        response.end();
    }
}

module.exports = SearchEventsRoute;