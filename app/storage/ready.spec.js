const { expect } = require('chai');
const { executeSync } = require('yop-postgresql');

describe('database', ()=>{

    it('can be reached', async ()=> {
        let rows = await executeSync('select 42 as number');
        expect(rows.length).to.equal(1);
        expect(rows[0].number).to.equal(42);
    })
})