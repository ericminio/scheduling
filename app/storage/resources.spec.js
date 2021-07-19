const { expect } = require('chai');
const { Database, ResourcesRepository, drop, migrate, EventsRepository } = require('.');
const { Resource, Event } = require('../domain');

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

    it('can delete', async ()=> {
        let resource = new Resource({ id:'this-id', type:'this-type', name:'this-name' })
        await repository.save(resource);
        await repository.delete('this-id');
        let instance = await repository.get('this-id');

        expect(instance).to.equal(undefined);
    });

    it('cascades deletion to event associated', async ()=> {
        let r1 = new Resource({ id:'r1-id', type:'r1-type', name:'r1-name' });
        let r2 = new Resource({ id:'r2-id', type:'r2-type', name:'r2-name' });
        repository.save(r1);
        repository.save(r2);
        let eventsRepository = new EventsRepository(database);
        await eventsRepository.save(new Event({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[{id:'r1-id'}, {id:'r2-id'}]
        }));
        await repository.delete('r2-id');
        let event = await eventsRepository.get('event-id');

        expect(event).to.deep.equal(new Event({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[{ id:'r1-id', type:'r1-type', name:'r1-name' }]
        }));
    });

    it('cascades deletion to event itself when resource was the only one', async ()=> {
        let r1 = new Resource({ id:'r1-id', type:'r1-type', name:'r1-name' });
        repository.save(r1);
        let eventsRepository = new EventsRepository(database);
        await eventsRepository.save(new Event({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[{id:'r1-id'}]
        }));
        await repository.delete('r1-id');
        let event = await eventsRepository.get('event-id');

        expect(event).to.equal(undefined);
    });
});