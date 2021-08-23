const { expect } = require('chai');
const { EventFactoryWithDependencies } = require('..');

describe('Event Factory', ()=>{

    let factory;
    beforeEach(()=>{
        factory = new EventFactoryWithDependencies();
    })

    it('rejects empty label', async ()=>{
        try { await factory.createEvent({ notes:'without label' }); }
        catch (error) {
            expect(error.message).to.equal('Label can not be empty');
        }
    });
    it('rejects invalid start time', async ()=>{
        try { 
            await factory.createEvent({ 
                label:'not empty',
                start:'1980-05-25 8:00' 
            });
            throw 'should fail';
        }
        catch (error) {
            expect(error.message).to.equal('Invalid date. Expected format is yyyy-mm-dd');
        }
    });
    it('rejects invalid end time', async ()=>{
        try { 
            await factory.createEvent({ 
                label:'not empty',
                start:'1980-05-25 07:00',
                end:'1980-05-25 8:00'
            });
            throw 'should fail';
        }
        catch (error) {
            expect(error.message).to.equal('Invalid date. Expected format is yyyy-mm-dd');
        }
    });

    it('creates event otherwise', async ()=>{
        let event = await factory.createEvent({ 
            label:'not empty',
            start:'1980-05-25 08:00',
            end:'1980-05-25 18:00'
        });

        expect(event.getLabel()).to.equal('not empty')
    });
})