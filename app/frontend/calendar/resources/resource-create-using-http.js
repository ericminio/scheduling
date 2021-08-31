class ResourceCreateUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please(resource) {
        return this.http.post('/data/resources/create', resource)
    }
};