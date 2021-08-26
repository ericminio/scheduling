const { expect } = require('chai');
const SearchEventsRoute = require('./search-events');

describe.only('SearchEventsRoute', ()=> {

    it('propagates to service', async ()=> {
        let spy;
        let server = {};
        server.adapters = {
            searchEvents: { async inRange(start, end) { spy = { start:start, end:end }; } }
        };
        let request = {
            url: '/data/events?date=2015-09-21'
        };
        let response = {
            setHeader: ()=>{},
            write: ()=> {},
            end: ()=> {}
        };
        await new SearchEventsRoute().go(request, response, server);
        expect(spy).to.deep.equal({ 
            start:'2015-09-21 00:00:00', 
            end:'2015-09-22 00:00:00' 
        });
    })
})