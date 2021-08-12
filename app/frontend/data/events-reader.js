class EventsReader {
    constructor(api) {
        this.api = api;
    }
    getEvents(date) {
        return new Promise((resolve, reject)=> {
            this.api.getEvents(date)
                .then((data)=> { 
                    let collection = data.events;
                    let events = [];
                    collection.forEach((item)=> {
                        events.push(new Event(item));
                    })
                    resolve({ events:events });
                })
                .catch((error)=> reject(error));
        });
    }
}
