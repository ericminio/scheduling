const { nextDay, formatDate, SearchEvents } = require('../../../domain');

class SearchEventsRoute {
    constructor() {
        this.prefix = '/data/events?date=';
        this.searchEvents = new SearchEvents();
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
        this.searchEvents.use(server.adapters);
        return this.searchEvents.inRange(start, end)
            .then((events)=>{
                response.statusCode = 200;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ events:events }));
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

module.exports = SearchEventsRoute;