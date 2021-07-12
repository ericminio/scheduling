const { expect } = require('chai');
const { Database, ResourcesRepository } = require('.');
const migrate = require('./migrations/migrate');
const { drop } = require('./migrations/drop');
const Resource = require('../domain/resource');

describe('Resources storage', ()=> {
    
    let repository;
    let database;
    beforeEach(async ()=>{
        database = new Database();
        repository = new ResourcesRepository(database);
        await drop(database);
        await migrate(database);
    });

    it('is ready', async ()=>{
        var rows = await database.executeSync('select id from resources')

        expect(rows.length).to.equal(0);
    });

    it('can save', async ()=> {
        let resource = new Resource({ id:'this-id', type:'this-type', name:'this-name' })
        await repository.save(resource);
        var rows = await database.executeSync('select id from resources')

        expect(rows.length).to.equal(1);
    });

    it('can fetch', async ()=> {
        let resource = new Resource({ id:'this-id', type:'this-type', name:'this-name' })        
        await repository.save(resource);
        let instance = await repository.get('this-id');

        expect(instance).to.deep.equal(resource);
        expect(instance instanceof Resource).to.equal(true);
    });

    it('can fetch all', async ()=> {
        let resource = new Resource({ id:'this-id', type:'this-type', name:'this-name' })        
        await repository.save(resource);
        let collection = await repository.all();

        expect(collection.length).to.equal(1);
        expect(collection[0]).to.deep.equal(resource);
        expect(collection[0] instanceof Resource).to.equal(true);
    });

    it('updates when saving same id', async ()=> {
        await repository.save(new Resource({ id:'this-id', type:'type #1', name:'name #1'}));
        await repository.save(new Resource({ id:'this-id', type:'type #2', name:'name #2'}));
        var rows = await database.executeSync('select name, type from resources')

        expect(rows.length).to.equal(1);
        expect(rows[0].name).to.equal('name #2');
        expect(rows[0].type).to.equal('type #2');
    });
});