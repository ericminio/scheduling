class GetResourcesUsingHttp {
    constructor(http) {
        this.http = http;
    }

    please() {
        return new Promise((resolve, reject)=> {
            this.http.get(`/data/resources`)
                .then(data => {
                    let collection = [];
                    data.resources.forEach(item => {
                        collection.push(new Resource(item))
                    })
                    resolve({ resources:collection });
                })
                .catch(error => { reject(error); })
        })
    }
};