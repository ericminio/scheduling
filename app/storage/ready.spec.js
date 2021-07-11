const { expect } = require('chai');
const { executeSync } = require('yop-postgresql');

describe('database', ()=>{

    it('discolses info', ()=>{
        let connectionString = {
            PGHOST: process.env.PGHOST,
            PGDATABASE: process.env.PGDATABASE,
            PGUSER: process.env.PGUSER,
            PGPASSWORD: process.env.PGPASSWORD,
            DATABASE_URL: process.env.DATABASE_URL
        };
        console.log('connection string', connectionString);        
    });
    
    it('can be reached', async ()=> {
        let rows = await executeSync('select 42 as number');
        expect(rows.length).to.equal(1);
        expect(rows[0].number).to.equal(42);
    })
})