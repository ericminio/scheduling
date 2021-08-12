class ResourcesReader {
    constructor(api) {
        this.api = api;
    }
    getResources() {
        return new Promise((resolve, reject)=> {
            this.api.getResources()
                .then((data)=> { 
                    let collection = data.resources;
                    let resources = [];
                    collection.forEach((item)=> {
                        resources.push(new Resource(item));
                    })
                    resolve({ resources:resources });
                })
                .catch((error)=> reject(error));
        });
    }
}
