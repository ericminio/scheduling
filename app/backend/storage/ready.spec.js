const { expect } = require('chai');
const { Database, drop, migrate, clear } = require('.');

describe('database', ()=>{

    it('is ready', async ()=> {
        let database = new Database();
        let rows = await database.executeSync('select $1::text as name', ['Joe']);
        expect(rows.length).to.equal(1);
        expect(rows[0].name).to.equal('Joe');
    });

    it('can be initialized', async ()=> {
        let database = new Database();
        await drop(database);
        await migrate(database);
        await clear(database);
    });

    it('can be run again', async ()=> {
        let database = new Database();
        await drop(database);
        await migrate(database);
        await migrate(database);
    });

});
