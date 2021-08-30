const { expect } = require('chai');
const { codes } = require('../../../utils/files');
const EventsSearchUsingHttp = 
    codes([
        './domain/calendar/event.js',
        './frontend/calendar/events/events-search-using-http.js'
    ], 'EventsSearchUsingHttp');

describe('Event search using Http', ()=>{

    let eventsSearch;
    let http = {};
    beforeEach(()=> {
        eventsSearch = new EventsSearchUsingHttp(http);
    })

    it('exposes event delete', ()=> {
        let spy = {};
        http.get = (uri)=> { spy = { uri:uri }; }
        eventsSearch.inRange('2015-07-01 00:00:00', '2015-07-02 00:00:00');

        expect(spy).to.deep.equal({
            uri: '/data/events?from=2015-07-01%2000%3A00%3A00&to=2015-07-02%2000%3A00%3A00'
        });
    });

    it('returns a collection of events', (done)=> {
        http.get = ()=> new Promise((resolve, reject)=> {
            resolve({ events:[{ id:42 }] });
        });
        eventsSearch.inRange('any', 'any')
            .then(data => {
                expect(data.events.length).to.equal(1);
                expect(data.events[0].getId()).to.equal(42);
                done();
            })
            .catch(error => done(error))
    });

})