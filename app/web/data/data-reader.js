class DataReader {
    constructor(api, store) {
        this.store = store;
        this.api = api;
    }
    configuration() {
        return new Promise((resolve, reject)=> {
            let definition = this.store.getObject('configuration');
            if (definition === null || 
                definition.title === undefined ||
                definition['opening-hours'] === undefined) {
                    this.api.configuration()
                        .then((definition)=> { 
                            let configuration = new Configuration(definition);
                            this.store.saveObject('configuration', configuration);  
                            resolve(configuration); 
                        })
                        .catch((error)=> reject(error));
            }
            else {
                let configuration = new Configuration(definition);
                resolve(configuration);
            }
        });
    }
}
var data = new DataReader(api, store);