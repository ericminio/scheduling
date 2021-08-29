class EventCreateUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please(event) {
        return this.http.post('/data/events/create', event)
    }
};