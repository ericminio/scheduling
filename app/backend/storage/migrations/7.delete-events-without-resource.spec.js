const { expect } = require('chai');
const { Database, ConfigurationRepository, drop, migrate } = require('..');
const fs = require('fs');
const path = require('path');

let contentOf = (name)=> {
    return fs.readFileSync(path.join(__dirname, name)).toString();
}
let run = async (file, database)=> {
    await database.executeSync(contentOf(file))
}

describe('Migration > 7: delete events created without resources', ()=>{

    let database;
    beforeEach(async ()=>{
        database = new Database();
        await drop(database);
        await migrate(database);
    });

    it('deletes as expected', async ()=>{
        await database.executeSync(`insert into events (id, label, notes, start_time, end_time) 
                                    values(42, 'label', 'notes', '2021-09-21 19:15:00', '2021-09-21 23:59:59')`);
        await run('7.delete-events-without-resource.sql', database);
        var rows = await database.executeSync('select * from events')

        expect(rows.length).to.equal(0);
    });

    it('keeps event with resources', async ()=>{
        await database.executeSync(`insert into events (id, label, notes, start_time, end_time) 
                                    values(42, 'label', 'notes', '2021-09-21 19:15:00', '2021-09-21 23:59:59')`);
        await database.executeSync(`insert into resources (id, type, name) values (15, 'type', 'name')`);
        await database.executeSync(`insert into events_resources (event_id, resource_id) values (42, 15)`);
        await run('7.delete-events-without-resource.sql', database);
        var rows = await database.executeSync('select * from events')

        expect(rows.length).to.equal(1);
    });
});