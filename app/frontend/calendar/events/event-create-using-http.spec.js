const { expect } = require('chai');
const { code } = require('../../../../yop/utils/files');
const EventCreateUsingHttp = code('./frontend/calendar/events/event-create-using-http.js', 'EventCreateUsingHttp');

describe('Events repository using Http', ()=>{

    let eventCreate;
    let http = {};
    beforeEach(()=> {
        eventCreate = new EventCreateUsingHttp(http);
    })

    it('exposes event storage', ()=> {
        let spy = {};
        http.post = (uri, payload)=> { spy = { uri:uri, payload:payload }; }
        eventCreate.please({ any:42 });

        expect(spy).to.deep.equal({
            uri: '/data/events/create',
            payload: { any:42 }
        });
    });

})