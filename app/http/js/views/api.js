class ApiClient {
    fetch(url) {
        return window.fetch(url);
    }

    getEvents() {
        return new Promise((resolve, reject)=>{
            this.fetch('/data/events').then((response) => {
                response.json().then((json) => {                    
                    resolve(json);
                });
            });
        });
    }
};
let api = new ApiClient();
