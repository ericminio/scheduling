const { expect } = require('chai');
const { Database, drop, migrate, ResourceExistsUsingPostgresql } = require('.');

describe('Resource exists', ()=> {
    
    let database;
    let resourceExists;
    let event;
    beforeEach(async ()=>{
        database = new Database();
        resourceExists = new ResourceExistsUsingPostgresql(database);
        await drop(database);
        await migrate(database);   
        await database.executeSync(`insert into resources (id, type, name) values (15, 'type', 'name')`);    
    });

    it('resolves for yes', (done)=>{
        resourceExists.withId(15)
            .then(()=> { done(); })
            .catch((error)=> { done(error); })
    });

    it('reject id for no', (done)=>{
        resourceExists.withId(14)
            .then(()=> { done('should fail'); })
            .catch((id)=> { 
                try {
                    expect(id).to.equal(14);
                    done();
                }
                catch (error) {
                    done(error);
                }
            })
    });

    it('propagates errors', async ()=>{
        try {
            await database.executeSync('drop table resources');
            await resourceExists.withId(15)
            throw { message:'should fail' };
        }
        catch(error) {
            expect(error.message).to.equal('relation "resources" does not exist');
        }
    });
})