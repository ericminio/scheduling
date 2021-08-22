const { expect } = require('chai');
const { code } = require('../../../utils/files');
const EventsRepositoryUsingHttp = code('./frontend/calendar/events/events-repository-using-http.js', 'EventsRepositoryUsingHttp');

describe('Events repository using Http', ()=>{

    let eventsRepository;
    let http = {};
    beforeEach(()=> {
        eventsRepository = new EventsRepositoryUsingHttp(http);
    })

    it('exposes event storage', ()=> {
        let spy = {};
        http.post = (uri, payload)=> { spy = { uri:uri, payload:payload }; }
        eventsRepository.storeEvent({ any:42 });

        expect(spy).to.deep.equal({
            uri: '/data/events/create',
            payload: { any:42 }
        });
    });

})