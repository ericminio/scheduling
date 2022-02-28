const { expect } = require('chai');
const { Database, drop, migrate, EventSearchUsingPostgresql } = require('.');

describe('Events storage search', ()=> {
    
    let database;
    let searchEvents;
    beforeEach(async ()=>{
        database = new Database();
        searchEvents = new EventSearchUsingPostgresql(database);
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
    it('includes future event when open ended is used', async ()=>{
        await givenEvent('              |---|');
        await whenSearch('      |--- ');

        expect(found.length).to.equal(1);
    });

    let found;
    let givenEvent = async (spec)=>{
        let event_range = range(spec);
        await database.executeSync(
            'insert into events(id, label, notes, start_time, end_time) values($1, $2, $3, $4, $5)', 
            [15, 'label', 'notes', event_range.start_time, event_range.end_time]);
        await database.executeSync("insert into resources(id, type, name) values(15, 'type', 'name')");
        await database.executeSync("insert into events_resources(event_id, resource_id) values(15, 15)");
    }
    let whenSearch = async (spec)=>{
        let search_range = range(spec);
        found = await searchEvents.inRange(search_range.start_time, search_range.end_time);
    }
    let range = (spec)=> {
        let start = 1 + spec.indexOf('|');
        if (start < 10) start = '0' + start;
        let end = 1 + spec.lastIndexOf('|');
        if (end < 10) end = '0' + end;
        let criteria =  { 
            start_time: '2021-09-21 19:00:' + start,
            end_time: '2021-09-21 19:00:' + end
        };
        if (spec.indexOf('|') == spec.lastIndexOf('|')) {
            criteria.end_time = undefined;
        }
        return criteria;
    }
})