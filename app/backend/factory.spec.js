const { expect } = require('chai');
const Factory = require('./factory');

describe('Factory', ()=> {

    let factory;
    beforeEach(()=> {
        factory = new Factory();
    })
    describe('Event creation', ()=> {

        it('generates missing id', async ()=> {
            factory.idGenerator = { next: ()=> 42 };
            let event = await factory.createEvent({ label:'any', resources:[] });

            expect(event.getId()).to.equal(42);
        })
    })
})