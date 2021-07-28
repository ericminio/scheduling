const { expect } = require('chai');
const { Database, EventsRepository, ResourcesRepository, drop, migrate } = require('.');
const Resource = require('../domain/resource');
const Event = require('../domain/event');
const EventsResourcesRepository = require('./events-resources-repository');

describe('Events storage', ()=> {
    
    let database;
    let resourcesRepository;
    let repository;
    let event;
    let r1, r2;
    beforeEach(async ()=>{
        database = new Database();
        resourcesRepository = new ResourcesRepository(database);
        repository = new EventsRepository(database);
        await drop(database);
        await migrate(database);

        r1 = new Resource({ id:'r1-id', type:'r1-type', name:'r1-name' });
        r2 = new Resource({ id:'r2-id', type:'r2-type', name:'r2-name' });
        resourcesRepository.save(r1);
        resourcesRepository.save(r2);
        event = new Event({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[{id:'r1-id'}, {id:'r2-id'}]
        });
    });

    it('is ready', async ()=>{
        var rows = await database.executeSync('select id from events')

        expect(rows.length).to.equal(0);
    });

    it('can save', async ()=> {
        await repository.save(event);
        
        let events = await database.executeSync('select * from events')
        expect(events.length).to.equal(1);
        let association = await database.executeSync('select * from events_resources')
        expect(association.length).to.equal(2);
    });

    it('can fetch', async ()=> {
        await repository.save(event);
        let instance = await repository.get('event-id');

        expect(instance instanceof Event).to.equal(true);
        expect(instance).to.deep.equal(new Event({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[r1, r2]
        }));
    });

    it('can fetch all', async ()=> {
        await repository.save(event);
        let collection = await repository.all();

        expect(collection.length).to.equal(1);
        expect(collection[0] instanceof Event).to.equal(true);
        expect(collection[0]).to.deep.equal({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[{id:'r1-id'}, {id:'r2-id'}]
        });
    });

    it('updates when saving same id', async ()=> {
        event.label = 'label #1';
        await repository.save(event);
        event.label = 'label #2';
        await repository.save(event);
        
        let events = await database.executeSync('select label from events')
        expect(events.length).to.equal(1);
        expect(events[0].label).to.equal('label #2');
        let resources = await database.executeSync('select * from resources')
        expect(resources.length).to.equal(2);
        let association = await database.executeSync('select * from events_resources')
        expect(association.length).to.equal(2);

        let fetched = await repository.get(event.getId());
        expect(fetched).to.deep.equal(new Event({ 
            id:'event-id', 
            label:'label #2', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[r1, r2]
        }));
    });

    it('can delete', async ()=> {
        await repository.save(event);
        await repository.delete('event-id');

        let instance = await repository.get('event-id');
        expect(instance).to.equal(undefined);

        let eventsResourcesRepository = new EventsResourcesRepository(database);
        let resources = await eventsResourcesRepository.getResourcesByEvent('event-id');
        expect(resources).to.deep.equal([]);
    });
})