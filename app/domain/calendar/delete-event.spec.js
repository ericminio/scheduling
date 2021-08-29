const { expect } = require('chai');
const { DeleteEvent, Event } = require('..');

describe('DeleteEvent', ()=>{

    let deleteEvent;

    beforeEach(()=>{
        deleteEvent = new DeleteEvent();
        deleteEvent.use({ 
            deleteEvent:{ please: (event)=> new Promise((resolve, reject)=>{ resolve(event.getId()) }) } 
        });
    });

    it('does it', (done)=>{
        deleteEvent.please(new Event({ id:42 }))
            .then((id)=>{
                try {
                    expect(id).to.equal(42);
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
            .catch((error)=> {
                done(error);
            })
    });

    it('propagates error if any', (done)=>{
        deleteEvent.use({ 
            deleteEvent:{ please: (event)=> new Promise((resolve, reject)=>{ reject(event.getId()) }) } 
        });
        deleteEvent.please(new Event({ id:66 }))
            .then(()=>{
                done('should fail');
            })
            .catch((error)=> {
                try {
                    expect(error).to.equal(66);
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

});