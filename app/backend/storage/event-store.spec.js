const { expect } = require('chai');
const { Database, drop, migrate, EventStoreUsingPostgresql } = require('.');
const { Event } = require('../../domain');

describe('Events store', ()=> {
    
    let database;
    let storeEvent;
    let event;
    beforeEach(async ()=>{
        database = new Database();
        storeEvent = new EventStoreUsingPostgresql(database);
        await drop(database);
        await migrate(database);
        event = new Event({label:'this label', resources:[{id:'r1'}, {id:'r2'}]});        
    });

    it('stores the event', (done)=>{
        storeEvent.please(event)
            .then(async ()=> {
                try {
                    let rows = await database.executeSync(`select label from events`);
                    expect(rows.length).to.equal(1);
                    expect(rows[0].label).to.equal('this label');
                    done();
                }
                catch(error) {
                    console.log(error);
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('stores the associated resources', (done)=>{
        storeEvent.please(event)
            .then(async ()=> {
                try {
                    let rows = await database.executeSync(`select resource_id from events_resources`);
                    expect(rows.length).to.equal(2);
                    expect(rows[0].resource_id).to.equal('r1');
                    expect(rows[1].resource_id).to.equal('r2');
                    done();
                }
                catch(error) {
                    console.log(error);
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('returns event with added id', (done)=>{
        storeEvent.idGenerator.next = ()=> 42
        storeEvent.please(event)
            .then((event)=> {
                try {
                    expect(event.id).to.equal(42);
                    done();
                }
                catch(error) {
                    console.log(error);
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('propagates errors', async ()=>{
        try {
            await database.executeSync('drop table events');
            await storeEvent.please(event);
            throw { message:'should fail' };
        }
        catch(error) {
            expect(error.message).to.equal('relation "events" does not exist');
        }
    });
})