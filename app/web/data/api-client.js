class ApiClient {
    fetch(url, options) {
        return window.fetch(url, options);
    }
    get(url) {
        return new Promise((resolve, reject)=>{
            this.fetch(url, { method:'GET' })
                .then((response) => {
                    response.json()
                        .then(json => {
                            resolve(json);
                        })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch((error)=> {
                    reject(error);
                });
        });
    }
    post(url, payload) {
        return new Promise((resolve, reject)=>{
            let options = { 
                method:'POST', 
                headers: { 'Content-Type': 'text/plain' },
                body:JSON.stringify(payload)
            };
            console.log(options);
            this.fetch(url, options)
                .then((response) => {
                    response.json()
                        .then(json => {
                            resolve(json);
                        }).catch(error => {
                            reject(error); 
                        });
                })
                .catch((error)=> {
                    reject(error);
                });
        });
    }

    ping() {
        return this.get('/ping');
    }

    getEvents() {
        return this.get('/data/events');
    }

    getResources() {
        return this.get('/data/resources');
    }

    createResource(payload) {
        return this.post('/data/resources/create', payload)
    }
}
let api = new ApiClient();
