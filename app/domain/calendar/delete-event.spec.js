const { expect } = require('chai');
const { DeleteEvent } = require('..');

describe('DeleteEvent', ()=>{

    let deleteEvent;

    beforeEach(()=>{
        deleteEvent = new DeleteEvent();
        deleteEvent.use({ 
            deleteEvent:{ please: (id)=> new Promise((resolve, reject)=>{ resolve(42) }) } 
        });
    });

    it('does it', (done)=>{
        deleteEvent.please()
            .then((ignored)=>{
                try {
                    expect(ignored).to.equal(42);
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('propagates error if any', (done)=>{
        deleteEvent.use({ 
            deleteEvent:{ please: (id)=> new Promise((resolve, reject)=>{ reject(66) }) } 
        });
        deleteEvent.please()
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