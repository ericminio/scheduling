class EventDeleteUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please(id) {
        return this.http.delete(`/data/events/${id}`)
    }
};