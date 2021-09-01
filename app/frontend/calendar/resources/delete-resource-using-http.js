class DeleteResourceUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please(resource) {
        return this.http.delete(`/data/resources/${resource.getId()}`)
    }
};