const { expect } = require('chai');
const { executeSync } = require('yop-postgresql')
const ResourcesRepository = require('./resources-repository')
const { migrate } = require('./migrations/migrate')
const { drop } = require('./migrations/drop')

describe('Resources storage', ()=> {
    
    let repository;
    beforeEach(async ()=>{
        process.env.PGUSER='dev';
        process.env.PGDATABASE='scheduling';
        process.env.PGHOST='localhost';
        process.env.PGPASSWORD='dev';
        repository = new ResourcesRepository();
        await drop();
        await migrate();
    });

    it('is ready', async ()=>{
        var rows = await executeSync('select id from resources')

        expect(rows.length).to.equal(0);
    });

    it('can save', async ()=> {
        await repository.save({ id:'this-id', type:'this-type', name:'this-name'});
        var rows = await executeSync('select id, type, name from resources')

        expect(rows.length).to.equal(1);
    });

    it('can fetch', async ()=> {
        await repository.save({ id:'this-id', type:'this-type', name:'this-name'});
        let instance = await repository.get('this-id');

        expect(instance).to.deep.equal({ id:'this-id', type:'this-type', name:'this-name'});
    });

    it('can fetch all', async ()=> {
        await repository.save({ id:'this-id', type:'this-type', name:'this-name'});
        let instance = await repository.all();

        expect(instance).to.deep.equal([{ id:'this-id', type:'this-type', name:'this-name'}]);
    });
});