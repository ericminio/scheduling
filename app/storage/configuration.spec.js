const { expect } = require('chai');
const { Database, ConfigurationRepository, drop, migrate } = require('.');
const { Configuration } = require('../domain');

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
        await repository.save(new Configuration({ title:'this-title' }));
        var rows = await database.executeSync('select key, value from configuration')

        expect(rows.length).to.equal(1);
        let record = rows[0];
        expect(record.key).to.equal('title');
        expect(record.value).to.equal('this-title');
    });

    it('can update', async ()=>{
        await repository.save(new Configuration({ title:'this-title' }));
        await repository.save(new Configuration({ title:'that-title' }));
        var rows = await database.executeSync('select key, value from configuration')

        expect(rows.length).to.equal(1);
        let record = rows[0];
        expect(record.key).to.equal('title');
        expect(record.value).to.equal('that-title');
    });

    it('can fetch', async ()=>{
        await repository.save(new Configuration({ title:'this-title' }));
        let configuration = await repository.get();

        expect(configuration).to.deep.equal(new Configuration({ title:'this-title' }));
    });

});