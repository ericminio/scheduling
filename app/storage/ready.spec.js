const { expect } = require('chai');
const { Database } = require('.');

describe('database', ()=>{

    it('is ready', async ()=> {
        let database = new Database();
        let rows = await database.executeSync('select $1::text as name', ['Joe']);
        expect(rows.length).to.equal(1);
        expect(rows[0].name).to.equal('Joe');
    });
});
