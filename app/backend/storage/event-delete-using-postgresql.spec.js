const { expect } = require('chai');
const { Database, drop, migrate, EventDeleteUsingPostgresql } = require('.');
const { Event } = require('../../domain')

describe('Event delete', ()=> {
    
    let database;
    let deleteEvent;
    beforeEach(async ()=>{
        database = new Database();
        deleteEvent = new EventDeleteUsingPostgresql(database);
        await drop(database);
        await migrate(database);
        await database.executeSync(`insert into events(id) values(1)`);
        await database.executeSync(`insert into events(id) values(15)`);
        await database.executeSync(`insert into resources(id) values(2)`);
        await database.executeSync(`insert into events_resources(event_id, resource_id) values(1, 2)`);
        await database.executeSync(`insert into events_resources(event_id, resource_id) values(15, 2)`);
    });

    it('deletes the event', (done)=>{
        deleteEvent.please(new Event({ id:1 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select id from events where id = $1', [1]);
                    expect(rows.length).to.equal(0);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('preserves the other events', (done)=>{
        deleteEvent.please(new Event({ id:1 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select id from events where id = $1', [15]);
                    expect(rows.length).to.equal(1);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('deletes the associated events_resources', (done)=>{
        deleteEvent.please(new Event({ id:1 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select event_id from events_resources where event_id = $1', [1]);
                    expect(rows.length).to.equal(0);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('preserves the other associations', (done)=>{
        deleteEvent.please(new Event({ id:1 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select event_id from events_resources where event_id = $1', [15]);
                    expect(rows.length).to.equal(1);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('propagates errors', async ()=>{
        try {
            await database.executeSync('drop table events');
            await deleteEvent.please(new Event({ id:1 }));
            throw { message:'should fail' };
        }
        catch(error) {
            expect(error.message).to.equal('relation "events" does not exist');
        }
    });
})