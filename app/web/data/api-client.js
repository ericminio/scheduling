class ApiClient {
    constructor(window) {
        this.window = window;
    }
    fetch(url, options) {
        return this.window.fetch(url, options);
    }
    then(resolve, reject) {
        return (response)=> {
            response.json()
                .then(json => {
                    if (response.status >= 400) {
                        this.window.events.notify('error', json);
                        reject(json);
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

    getEvents() {
        return this.get('/data/events');
    }

    getResources() {
        return this.get('/data/resources');
    }

    createResource(payload) {
        return this.post('/data/resources/create', payload)
    }

    createEvent(payload) {
        return this.post('/data/events/create', payload)
    }

    deleteEvent(event) {
        return this.delete(`/data/events/${event.id}`);
    }

    deleteResource(resource) {
        return this.delete(`/data/resources/${resource.id}`);
    }

    signIn(credentials) {
        let payload = { encoded: window.btoa(JSON.stringify(credentials)) };
        return this.post('/sign-in', payload);
    }
}
var api = new ApiClient(window);
