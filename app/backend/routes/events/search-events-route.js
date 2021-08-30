const { SearchEvents } = require('../../../domain');

class SearchEventsRoute {
    constructor() {
        this.pattern = /^\/data\/events\?from=(.*)&to=(.*)$/;
        this.searchEvents = new SearchEvents();
    }
    matches(request) {
        return request.method=='GET' && this.matchesUrl(request.url);
    }
    matchesUrl(url) {        
        if (this.pattern.test(url)) {
            let values = this.pattern.exec(url);
            let from = values[1];
            let to = values[2];
            return from != null && from.length > 0 &&
                   to != null && to.length > 0;
        }
        else {
            return false;
        }
    }
    parse(request) {
        return new Promise((resolve, reject)=> {
            try {
                let values = this.pattern.exec(request.url);
                let range = {
                    start: decodeURIComponent(values[1]),
                    end: decodeURIComponent(values[2])
                };
                resolve(range);
            }
            catch(error) {
                reject({ message:error.message });
            }
        })
    }
    async go(request, response, server) {
        this.searchEvents.use(server.adapters);
        return this.parse(request)
            .then(range => this.searchEvents.inRange(range.start, range.end))
            .then(events => {
                response.statusCode = 200;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ events:events }));
            })
            .catch(error => {
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