const { expect } = require('chai');
const { executeSync } = require('yop-postgresql')
const EventsRepository = require('./events-repository')
const { migrate } = require('./migrations/migrate')
const { drop } = require('./migrations/drop')

describe('Events storage', ()=> {
    
    let repository;
    beforeEach(async ()=>{
        process.env.PGUSER='dev';
        process.env.PGDATABASE='scheduling';
        process.env.PGHOST='localhost';
        process.env.PGPASSWORD='dev';
        repository = new EventsRepository();
        await drop();
        await migrate();
    });

    it('is ready', async ()=>{
        var rows = await executeSync('select id from events')

        expect(rows.length).to.equal(0);
    });

    it('can save', async ()=> {
        await repository.save({ id:'this-id', label:'Bob', 
            start:new Date('2015-01-15T19:15:00Z'), end:new Date('2015-07-14T23:42:15Z')});
        var rows = await executeSync('select id from events')

        expect(rows.length).to.equal(1);
    });

    it('can fetch', async ()=> {
        await repository.save({ id:'this-id', label:'Bob', 
            start:new Date('2015-01-15T19:15:00Z'), end:new Date('2015-07-14T23:42:15Z')});
        let instance = await repository.get('this-id');

        expect(instance).to.deep.equal({ id:'this-id', label:'Bob', 
            start:new Date('2015-01-15T19:15:00Z'), end:new Date('2015-07-14T23:42:15Z')});
    });

    it('can fetch all', async ()=> {
        await repository.save({ id:'this-id', label:'Bob', 
            start:new Date('2015-01-15T19:15:00Z'), end:new Date('2015-07-14T23:42:15Z')});
        let collection = await repository.all();

        expect(collection).to.deep.equal([{ id:'this-id', label:'Bob', 
            start:new Date('2015-01-15T19:15:00Z'), end:new Date('2015-07-14T23:42:15Z')}]);
    });
})