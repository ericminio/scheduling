const { expect } = require('chai');
const { Database, drop, migrate, DeleteResourceUsingPostgresql } = require('.');
const { Resource } = require('../../domain')

describe('Resource delete using postgres', ()=> {
    
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
})