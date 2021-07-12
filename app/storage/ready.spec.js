const { expect } = require('chai');

const Pool = require('pg-pool');
const url = require('url')

describe('database', ()=>{

    it('can be reached', async ()=> {
        const databaseUrl = process.env.DATABASE_URL;
        console.log('url', databaseUrl)
        const params = url.parse(databaseUrl);
        const auth = params.auth.split(':');

        const config = {
            user: auth[0],
            password: auth[1],
            host: params.hostname,
            port: params.port,
            database: params.pathname.split('/')[1]
        };
        console.log('config', config);
        const pool = new Pool(config);

        var result = await pool.query('select $1::text as name', ['Joe'])
        console.log(result.rows)
        expect(result.rows.length).to.equal(1)
        expect(result.rows[0].name).to.equal('Joe');
    })
})