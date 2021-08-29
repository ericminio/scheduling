class EventDeleteUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please(event) {
        return this.http.delete(`/data/events/${event.getId()}`)
    }
};