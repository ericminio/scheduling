var api = new ApiClient(window);

class DataReader {
    constructor(api, store) {
        this.configurationReader = new ConfigurationReader(api, store);
    }
    async configuration() {
        return await this.configurationReader.configuration();
    }
}
var data = new DataReader(api, store);