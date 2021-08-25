const { expect } = require('chai');
const { Database, EventsRepository, drop, migrate } = require('.');
const { Event } = require('../../domain');

describe('Events storage search', ()=> {
    
    let database;
    let repository;
    beforeEach(async ()=>{
        database = new Database();
        repository = new EventsRepository(database);
        await drop(database);
        await migrate(database);
    });
    it('excludes past event', async ()=>{
        await givenEvent('|---|');
        await whenSearch('      |---|');

        expect(found.length).to.equal(0);
    });
    it('includes event in range', async ()=>{
        await givenEvent('    |---|');
        await whenSearch('  |-------|');

        expect(found.length).to.equal(1);
    });
    it('includes event matching range', async ()=>{
        await givenEvent('  |-------|');
        await whenSearch('  |-------|');

        expect(found.length).to.equal(1);
    });
    it('excludes future event', async ()=>{
        await givenEvent('              |---|');
        await whenSearch('      |---|');

        expect(found.length).to.equal(0);
    });
    it('excludes just past event', async ()=>{
        await givenEvent('  |---|');
        await whenSearch('      |---|');

        expect(found.length).to.equal(0);
    });
    it('excludes just future event', async ()=>{
        await givenEvent('          |---|');
        await whenSearch('      |---|');

        expect(found.length).to.equal(0);
    });

    let found;
    let givenEvent = async (spec)=>{
        let event_range = range(spec);
        await repository.save(new Event({ 
            id:'2', 
            label:'event-label', 
            start:event_range.start_time, 
            end:event_range.end_time,
            resources:[{id:'r1-id'}]
        }));
    }
    let whenSearch = async (spec)=>{
        let search_range = range(spec);
        found = await repository.search(search_range.start_time, search_range.end_time);
    }
    let range = (spec)=> {
        let start = 1 + spec.indexOf('|');
        if (start < 10) start = '0' + start;
        let end = 1 + spec.lastIndexOf('|');
        if (end < 10) end = '0' + end;
        return { 
            start_time: '2021-09-21 19:00:' + start,
            end_time: '2021-09-21 19:00:' + end
        };
    }
})