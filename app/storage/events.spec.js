const { expect } = require('chai');
const { executeSync } = require('yop-postgresql')
const { EventsRepository, ResourcesRepository } = require('.');
const migrate = require('./migrations/migrate')
const { drop } = require('./migrations/drop')
const Resource = require('../domain/resource');
const Event = require('../domain/event');

describe('Events storage', ()=> {
    
    let resourcesRepository;
    let repository;
    let event;
    let r1, r2;
    beforeEach(async ()=>{
        resourcesRepository = new ResourcesRepository();
        process.env.PGUSER='dev';
        process.env.PGDATABASE='scheduling';
        process.env.PGHOST='localhost';
        process.env.PGPASSWORD='dev';
        repository = new EventsRepository();
        await drop();
        await migrate();

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
        var rows = await executeSync('select id from events')

        expect(rows.length).to.equal(0);
    });

    it('can save', async ()=> {
        await repository.save(event);
        
        let events = await executeSync('select * from events')
        expect(events.length).to.equal(1);
        let association = await executeSync('select * from events_resources')
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
        expect(collection[0]).to.deep.equal(new Event({ 
            id:'event-id', 
            label:'event-label', 
            start:'2015-01-15 19:15:00', 
            end:'2015-07-14T23:42:15',
            resources:[r1, r2]
        }));
    });

    it('updates when saving same id', async ()=> {
        event.label = 'label #1';
        await repository.save(event);
        event.label = 'label #2';
        await repository.save(event);
        
        let events = await executeSync('select label from events')
        expect(events.length).to.equal(1);
        expect(events[0].label).to.equal('label #2');
        let resources = await executeSync('select * from resources')
        expect(resources.length).to.equal(2);
        let association = await executeSync('select * from events_resources')
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
})