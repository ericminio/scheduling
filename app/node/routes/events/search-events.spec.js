const { expect } = require('chai');
const SearchEventsRoute = require('./search-events');

describe('SearchEventsRoute', ()=> {

    it('propagates to service', async ()=> {
        let spy;
        let server = {
            services: {
                'events': {
                    search: async(date)=> {
                        spy = date;
                    }
                }
            }
        }
        let request = {
            url: '/data/events?date=2015-09-21'
        };
        let response = {
            setHeader: ()=>{},
            write: ()=> {},
            end: ()=> {}
        };
        await new SearchEventsRoute().go(request, response, server);
        expect(spy).to.equal('2015-09-21');
    })
})