const { expect } = require('chai');
const { CreateEventWithDependencies } = require('..');

describe('CreateEvent', ()=>{

    let createEvent;

    beforeEach(()=>{
        createEvent = new CreateEventWithDependencies();
        createEvent.use({ 
            events:{ save: async(event)=>{} } 
        });
        createEvent.eventFactory.buildEvent = (incoming)=> new Promise((resolve, reject)=>{ resolve({ id:15 }) })
    });

    it('builds the event', (done)=>{
        createEvent.please({})
            .then((event)=>{
                try {
                    expect(event).to.deep.equal({ id:15 });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('stores the event', (done)=>{
        let spy;
        createEvent.eventsRepository.save = async (event)=> { spy = event; }
        createEvent.please({})
            .then((event)=>{
                try {
                    expect(spy).to.deep.equal({ id:15 });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('returns the event as modified', (done)=>{
        createEvent.eventsRepository.save = async (event)=> { event.touched = true; }
        createEvent.please({})
            .then((event)=>{
                try {
                    expect(event.touched).to.equal(true);
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });
})