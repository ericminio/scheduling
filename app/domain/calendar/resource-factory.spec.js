const { expect } = require('chai');
const { ResourceFactoryWithDependencies } = require('..');

describe('ResourceFactory', ()=>{

    let factory;
    beforeEach(()=>{
        factory = new ResourceFactoryWithDependencies();
    });

    it('creates resource', (done)=>{
        factory.buildResource({  type: 'this type', name: 'this name' })
            .then(resource => {
                try {
                    expect(resource.getType()).to.equal('this type');
                    expect(resource.getName()).to.equal('this name');
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch(error => done(error));
    });

    it('rejects empty type', (done)=>{
        factory.buildResource({  name: 'empty type' })
            .then(() => {
                done('shoud fail')
            })
            .catch(error => {
                try {
                    expect(error.message).to.equal('Type can not be empty');
                    done();
                }
                catch(error) {
                    done(error);
                }
            });
    });

    it('rejects empty name', (done)=>{
        factory.buildResource({  type: 'empty name' })
            .then(() => {
                done('shoud fail')
            })
            .catch(error => {
                try {
                    expect(error.message).to.equal('Name can not be empty');
                    done();
                }
                catch(error) {
                    done(error);
                }
            });
    });
})