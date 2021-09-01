const { expect } = require('chai');
const { Database, drop, migrate, DeleteResourceUsingPostgresql } = require('.');
const { Resource } = require('../../domain')

describe('Resource delete using postgresql', ()=> {
    
    let database;
    let deleteResource;
    let cacheReset;
    beforeEach(async ()=>{
        database = new Database();
        deleteResource = new DeleteResourceUsingPostgresql(database, { delete:(key)=> { cacheReset = key; } });
        await drop(database);
        await migrate(database);
        await database.executeSync(`insert into resources(id) values(1)`);
        await database.executeSync(`insert into resources(id) values(15)`);
        await database.executeSync(`insert into events(id) values(3)`);
        await database.executeSync(`insert into events_resources(event_id, resource_id) values(3, 15)`);
        
        await database.executeSync(`insert into resources(id) values(41)`);
        await database.executeSync(`insert into resources(id) values(42)`);
        await database.executeSync(`insert into events(id) values(1)`);
        await database.executeSync(`insert into events_resources(event_id, resource_id) values(1, 41)`);
        await database.executeSync(`insert into events(id) values(2)`);
        await database.executeSync(`insert into events_resources(event_id, resource_id) values(2, 41)`);
        await database.executeSync(`insert into events_resources(event_id, resource_id) values(2, 42)`);
    });

    it('deletes the resource', (done)=>{
        deleteResource.please(new Resource({ id:1 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select id from resources where id = $1', [1]);
                    expect(rows.length).to.equal(0);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('preserves the other resources', (done)=>{
        deleteResource.please(new Resource({ id:1 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select id from resources where id = $1', [15]);
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
            await database.executeSync('drop table resources');
            await deleteResource.please(new Resource({ id:1 }));
            throw { message:'should fail' };
        }
        catch(error) {
            expect(error.message).to.equal('relation "resources" does not exist');
        }
    });

    it('resets the cache', async ()=>{
        await deleteResource.please(new Resource({ id:1 }))
        
        expect(cacheReset).to.equal('all');
    });

    it('cascades deletion to association', (done)=>{
        deleteResource.please(new Resource({ id:42 }))
            .then(async ()=> {
                try {
                    let rows = await database.executeSync('select resource_id from events_resources where resource_id = $1', [42]);
                    expect(rows.length).to.equal(0);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('cascades deletion to event when resource was the only one associated', (done)=>{
        deleteResource.please(new Resource({ id:41 }))
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
})