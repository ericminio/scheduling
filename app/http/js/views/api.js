class ApiClient {
    fetch(url) {
        return window.fetch(url);
    }
    get(url) {
        return new Promise((resolve, reject)=>{
            this.fetch(url)
                .then((response) => {
                    response.json().then((json) => {                    
                        resolve(json);
                    });
                })
                .catch((error)=> {
                    reject(error);
                });
        });
    }

    getEvents() {
        return this.get('/data/events');
    }

    getResources() {
        return this.get('/data/resources');
    }
};
let api = new ApiClient();
