const { expect } = require('chai');
const { Database, ConfigurationRepository, drop, migrate } = require('.');
const { Configuration } = require('../../domain');

describe('Configuration storage', ()=> {
    
    let repository;
    let database;
    beforeEach(async ()=>{
        database = new Database();
        repository = new ConfigurationRepository(database);
        await drop(database);
        await migrate(database);
    });

    it('is ready', async ()=>{
        var rows = await database.executeSync('select * from configuration')

        expect(rows.length).to.equal(0);
    });

    it('can create', async ()=>{
        await repository.save(new Configuration({ title:'this-title', 'opening-hours':'10-20' }));
        var rows = await database.executeSync('select key, value from configuration')

        expect(rows.length).to.equal(2);
        expect(rows[0].key).to.equal('title');
        expect(rows[0].value).to.equal('this-title');
        expect(rows[1].key).to.equal('opening-hours');
        expect(rows[1].value).to.equal('10-20');
    });

    it('can update', async ()=>{
        await repository.save(new Configuration({ title:'this-title', 'opening-hours':'this-range' }));
        await repository.save(new Configuration({ title:'that-title', 'opening-hours':'that-range' }));
        var rows = await database.executeSync('select key, value from configuration')

        expect(rows.length).to.equal(2);
        expect(rows[0].key).to.equal('title');
        expect(rows[0].value).to.equal('that-title');
        expect(rows[1].key).to.equal('opening-hours');
        expect(rows[1].value).to.equal('that-range');
    });

    it('can fetch', async ()=>{
        await repository.save(new Configuration({ title:'this-title' }));
        let configuration = await repository.get();

        expect(configuration).to.deep.equal(new Configuration({ title:'this-title' }));
    });

});