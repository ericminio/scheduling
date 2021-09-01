const { expect } = require('chai');
const { CreateEventWithDependencies, Event } = require('..');

describe('CreateEvent', ()=>{

    let createEvent;

    beforeEach(()=>{
        createEvent = new CreateEventWithDependencies();
        createEvent.use({ 
            storeEvent:{ please: async(event)=> new Promise((resolve, reject)=>{ event.notes='stored'; resolve(event); }) } 
        });
        createEvent.eventFactory = { buildEvent: (incoming)=> new Promise((resolve, reject)=>{ resolve(new Event({ label:'built' })) }) }
    });

    it('builds the event', (done)=>{
        createEvent.please({})
            .then((event)=>{
                try {
                    expect(event.getLabel()).to.equal('built');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('stores the event', (done)=>{
        createEvent.please({})
            .then((event)=>{
                try {
                    expect(event.getNotes()).to.equal('stored');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('btw returns the event as modified along the way', (done)=>{
        createEvent.please({})
            .then((event)=>{
                try {
                    expect(event.getNotes()).to.equal('stored');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('propagates factory error', (done)=>{
        createEvent.eventFactory.buildEvent = (incoming)=> new Promise((resolve, reject)=>{ reject({ message:'factory failed' }); })
        createEvent.please({})
            .then(()=>{
                done('should fail');
            })
            .catch((error)=>{
                try {
                    expect(error).to.deep.equal({ message:'factory failed' });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('propagates storage error', (done)=>{
        createEvent.use({ 
            storeEvent:{ please: async(event)=> new Promise((resolve, reject)=>{ reject({ message:'store failed' }); }) } 
        });
        createEvent.please({})
            .then(()=>{
                done('should fail');
            })
            .catch((error)=>{
                try {
                    expect(error).to.deep.equal({ message:'store failed' });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });
})