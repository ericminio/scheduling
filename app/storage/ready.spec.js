const { expect } = require('chai');

const Pool = require('pg-pool');
const url = require('url')

describe('database', ()=>{

    it('can be reached', async ()=> {
        const url = process.env.DATABASE_URL;
        console.log('url', url)
        const params = url.parse(url);
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

        var name = await pool.query('select $1::text as name', ['Joe'])
        expect(name).to.equal('Joe');
    })
})