const { expect } = require('chai');
const { CreateResourceWithDependencies, Resource } = require('..');

describe('CreateResource', ()=>{

    let createResource;

    beforeEach(()=>{
        createResource = new CreateResourceWithDependencies();
        createResource.use({ 
            storeResource:{ please: async(resource)=> new Promise((resolve, reject)=>{ resource.name='stored'; resolve(resource); }) } 
        });
        createResource.resourceFactory = { buildResource: (incoming)=> new Promise((resolve, reject)=>{ resolve(new Resource({ type:'built' })) }) }
    });

    it('builds the resource', (done)=>{
        createResource.please({})
            .then((resource)=>{
                try {
                    expect(resource.getType()).to.equal('built');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('stores the resource', (done)=>{
        createResource.please({})
            .then((resource)=>{
                try {
                    expect(resource.getName()).to.equal('stored');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('btw returns the resource as modified along the way', (done)=>{
        createResource.please({})
            .then((resource)=>{
                try {
                    expect(resource.getName()).to.equal('stored');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            })
    });

    it('propagates factory error', (done)=>{
        createResource.resourceFactory.buildResource = (incoming)=> new Promise((resolve, reject)=>{ reject({ message:'factory failed' }); })
        createResource.please({})
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
        createResource.use({ 
            storeResource:{ please: async(event)=> new Promise((resolve, reject)=>{ reject({ message:'store failed' }); }) } 
        });
        createResource.please({})
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