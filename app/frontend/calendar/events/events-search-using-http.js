class EventsSearchUsingHttp {
    constructor(http) {
        this.http = http;
    }

    inRange(start, end) {
        let search = `from=${encodeURIComponent(start)}&to=${encodeURIComponent(end)}`;
        return new Promise((resolve, reject)=> {
            this.http.get(`/data/events?${search}`)
                .then(data => {
                    let collection = [];
                    data.events.forEach(item => {
                        collection.push(new Event(item))
                    })
                    resolve({ events:collection });
                })
                .catch(error => { reject(error); })
        })
    }
}