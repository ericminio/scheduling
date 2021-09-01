const { expect } = require('chai');
const { DeleteResource, Resource } = require('..');

describe('DeleteResource', ()=>{

    let deleteResource;

    beforeEach(()=>{
        deleteResource = new DeleteResource();
        deleteResource.use({ 
            deleteResource:{ please: (resource)=> new Promise((resolve, reject)=>{ resolve(resource.getId()) }) } 
        });
    });

    it('does it', (done)=>{
        deleteResource.please(new Resource({ id:42 }))
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
        deleteResource.use({ 
            deleteResource:{ please: (resource)=> new Promise((resolve, reject)=>{ reject(resource.getId()) }) } 
        });
        deleteResource.please(new Resource({ id:66 }))
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