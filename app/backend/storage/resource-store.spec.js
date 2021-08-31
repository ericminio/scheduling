const { expect } = require('chai');
const { Database, drop, migrate, ResourceStoreUsingPostgresql } = require('.');
const { Resource } = require('../../domain');

describe('Resource store', ()=> {
    
    let database;
    let storeResource;
    let resource;
    let cacheWasReset;
    beforeEach(async ()=>{
        cacheReset = false;
        database = new Database();
        storeResource = new ResourceStoreUsingPostgresql(database, { delete:(key)=> { cacheReset = key; } });
        await drop(database);
        await migrate(database);
        resource = new Resource({ type:'this type', name:'this name' });        
    });

    it('stores the resource', (done)=>{
        storeResource.please(resource)
            .then(async ()=> {
                try {
                    let rows = await database.executeSync(`select type, name from resources`);
                    expect(rows.length).to.equal(1);
                    expect(rows[0].type).to.equal('this type');
                    expect(rows[0].name).to.equal('this name');
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
            .catch((error)=> { done(error); })
    });

    it('returns resource with added id', (done)=>{
        storeResource.idGenerator.next = ()=> 42
        storeResource.please(resource)
            .then((resource)=> {
                try {
                    expect(resource.getId()).to.equal(42);
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
            await storeResource.please(resource);
            throw { message:'should fail' };
        }
        catch(error) {
            expect(error.message).to.equal('relation "resources" does not exist');
        }
    });

    it('propagates errors', async ()=>{
        await storeResource.please(resource);
        
        expect(cacheReset).to.equal('all');
    });
})