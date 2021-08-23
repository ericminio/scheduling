const { expect } = require('chai');
const { FactoryWithDependencies } = require('..');

describe('EventFactory', ()=> {

    let factory;
    beforeEach(()=> {
        factory = new FactoryWithDependencies();
        factory.eventsRepository = { all: async()=> [] }
    });

    it('builds expected event', async ()=> {
        let event = await factory.buildEvent({ label:'any', resources:[] });

        expect(event.getLabel()).to.equal('any');
    })
})