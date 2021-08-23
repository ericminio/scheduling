const { expect } = require('chai');
const Factory = require('./factory');

describe('Factory', ()=> {

    let factory;
    beforeEach(()=> {
        factory = new Factory();
        factory.eventsRepository = { all: async()=> [] }
    })
    describe('Event creation', ()=> {

        it('generates missing id', async ()=> {
            factory.idGenerator = { next: ()=> 42 };
            let event = await factory.buildEvent({ label:'any', resources:[] });

            expect(event.getId()).to.equal(42);
        })
    })
})