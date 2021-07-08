class ApiClient {
    fetch(url) {
        return window.fetch(url);
    }

    getEvents() {
        return new Promise((resolve, reject)=>{
            this.fetch('/data/events')
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

    getResources() {
        return new Promise((resolve, reject)=>{
            this.fetch('/data/resources')
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
};
let api = new ApiClient();
