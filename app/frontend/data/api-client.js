class ApiClient {
    constructor(window) {
        this.window = window;
    }
    fetch(url, options) {
        let user = this.window.store.getObject('user');
        if (user !== null) {
            let headers = new this.window.Headers();
            headers.append('x-user-key', user.key);
            options.headers = headers;
        }
        return this.window.fetch(url, options);
    }
    then(resolve, reject) {
        return (response)=> {
            response.json()
                .then(json => {
                    if (response.status >= 400) {
                        this.window.events.notify('error', json);
                        reject();
                    } else {
                        resolve(json);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        };
    }
    catch(reject) {
        return (error)=> {
            reject(error);
        }
    }   
    get(url) {
        return new Promise((resolve, reject)=>{
            let options = { 
                method:'GET'
            };
            this.fetch(url, options)
                .then(this.then(resolve, reject))
                .catch(this.catch(reject));
        });
    }
    post(url, payload) {
        return new Promise((resolve, reject)=>{
            let options = { 
                method:'POST', 
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            };
            this.fetch(url, options)
                .then(this.then(resolve, reject))
                .catch(this.catch(reject));
        });
    }

    delete(url) {
        return new Promise((resolve, reject)=>{
            let options = { 
                method:'DELETE'
            };
            this.fetch(url, options)
                .then(this.then(resolve, reject))
                .catch(this.catch(reject));
        });
    }

    ping() {
        return this.get('/ping');
    }

    getEvents(date) {
        return this.get(`/data/events?date=${date}`);
    }

    getResources() {
        return this.get('/data/resources');
    }

    createResource(payload) {
        return this.post('/data/resources/create', payload)
    }

    deleteResource(resource) {
        return this.delete(`/data/resources/${resource.id}`);
    }

    signIn(credentials) {
        let payload = { encoded: window.btoa(JSON.stringify(credentials)) };
        return this.post('/sign-in', payload);
    }

    configuration() {
        return this.get('/data/configuration');
    }
    saveConfiguration(payload) {
        return this.post('/data/configuration', payload)
    }
}

