const { expect } = require('chai');
const { code } = require('../../../../yop/utils/files');
const EventDeleteUsingHttp = code('./frontend/calendar/events/event-delete-using-http.js', 'EventDeleteUsingHttp');
const { Event } = require('../../../domain')

describe('Event delete using Http', ()=>{

    let eventDelete;
    let http = {};
    beforeEach(()=> {
        eventDelete = new EventDeleteUsingHttp(http);
    })

    it('exposes event delete', ()=> {
        let spy = {};
        http.delete = (uri)=> { spy = { uri:uri }; }
        eventDelete.please(new Event({ id:42 }));

        expect(spy).to.deep.equal({
            uri: '/data/events/42'
        });
    });

})