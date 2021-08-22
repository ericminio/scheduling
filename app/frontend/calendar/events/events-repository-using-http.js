class EventsRepositoryUsingHttp {
    constructor(http) {
        this.http = http;
    }

    storeEvent(payload) {
        return this.http.post('/data/events/create', payload)
    }
};