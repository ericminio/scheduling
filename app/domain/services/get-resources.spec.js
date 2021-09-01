const { expect } = require('chai');
const { GetResources } = require('..');

describe('GetResources', ()=>{

    let getResources;

    beforeEach(()=>{
        getResources = new GetResources();
        getResources.use({ 
            getResources:{ please: async()=> new Promise((resolve, reject)=>{ resolve([{ id:15 }]) }) } 
        });
    });

    it('returns collection from adapter', (done)=>{
        getResources.please()
            .then((resources)=>{
                try {
                    expect(resources).to.deep.equal([{ id:15 }]);
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('propagates error if any', (done)=>{
        getResources.use({ 
            getResources:{ please: async()=> new Promise((resolve, reject)=>{ reject({ message:'get failed' }); }) } 
        });
        getResources.please()
            .then(()=>{
                done('should fail');
            })
            .catch((error)=> {
                try {
                    expect(error).to.deep.equal({ message:'get failed' });
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

});