const { expect } = require('chai');
const { SearchEvents } = require('..');

describe('SearchEvents', ()=>{

    let searchEvents;

    beforeEach(()=>{
        searchEvents = new SearchEvents();
        searchEvents.use({ 
            searchEvents:{ inRange: async(start, end)=> new Promise((resolve, reject)=>{ resolve([{ id:15 }]) }) } 
        });
    });

    it('returns collection from adapter', (done)=>{
        searchEvents.inRange()
            .then((events)=>{
                try {
                    expect(events).to.deep.equal([{ id:15 }]);
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('propagates error if any', (done)=>{
        searchEvents.use({ 
            searchEvents:{ inRange: async(start, end)=> new Promise((resolve, reject)=>{ reject({ message:'search failed' }); }) } 
        });
        searchEvents.inRange()
            .then((events)=>{
                done('should fail');
            })
            .catch((error)=> {
                try {
                    expect(error).to.deep.equal({ message:'search failed' });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

});