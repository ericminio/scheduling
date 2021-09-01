const { expect } = require('chai');
const { Database, drop, migrate, GetResourcesUsingPostgresql } = require('.');
const { Resource } = require('../../domain');

describe('Get Resources', ()=> {
    
    let database;
    let getResources;
    let cached;
    let cache;
    beforeEach(async ()=>{
        cache = {
            put:(key, value)=> { cached = { key:key, value:value } },
            get: (key)=> undefined
        };
        database = new Database();
        getResources = new GetResourcesUsingPostgresql(database, cache);
        await drop(database);
        await migrate(database);   
        await database.executeSync(`insert into resources (id, type, name) values (3, 'type-3', 'name-3')`);
        await database.executeSync(`insert into resources (id, type, name) values (2, 'type-2', 'name-2')`);
        await database.executeSync(`insert into resources (id, type, name) values (1, 'type-1', 'name-01')`);
        await database.executeSync(`insert into resources (id, type, name) values (4, 'type-1', 'name-02')`);
    });

    it('returns all resources ordered by type and name', (done)=>{
        getResources.please()
            .then(resources => { 
                expect(resources.length).to.equal(4);
                expect(resources[0].getId()).to.equal('1');
                expect(resources[1].getName()).to.equal('name-02');
                expect(resources[2].getType()).to.equal('type-2');
                expect(resources[3].getType()).to.equal('type-3');
                done();
             })
            .catch(error=> { 
                done(error);
            })
    });

    it('propagates errors', async ()=>{
        try {
            await database.executeSync('drop table resources');
            await getResources.please();
            throw { message:'should fail' };
        }
        catch(error) {
            expect(error.message).to.equal('relation "resources" does not exist');
        }
    });

    it('saves collection in the cache', async ()=>{
        await getResources.please();
        
        expect(cached.key).to.equal('all');
        expect(cached.value.length).to.equal(4);
    });

    it('returns resources from the cache when present', (done)=>{
        cache.get = ()=> [new Resource({id:15})]
        getResources.please()
            .then(resources => { 
                expect(resources.length).to.equal(1);
                expect(resources[0].getId()).to.equal(15);
                done();
             })
            .catch(error=> { 
                done(error);
            })
    });
})