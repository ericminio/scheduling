var api = new ApiClient(window);

class DataReader {
    constructor(api, store) {
        this.configurationReader = new ConfigurationReader(api, store);
        this.resourcesReader = new ResourcesReader(api);
    }
    async configuration() {
        return await this.configurationReader.configuration();
    }
    async getResources() {
        return await this.resourcesReader.getResources();
    }
}
var data = new DataReader(api, store);