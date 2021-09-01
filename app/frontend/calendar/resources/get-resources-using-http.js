class GetResourcesUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please() {
        return this.http.get(`/data/resources`)
    }
};