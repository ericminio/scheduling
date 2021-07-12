const { expect } = require('chai');
var pg = require('pg')

const Pool = require('pg-pool');
const url = require('url')

describe('database', ()=>{

    it('can be reached via pg', async ()=> {
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

    it('can be reached via yop-postgresql', async ()=> {
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
        

        var executeSync = async function(sql, params) {
            var statements = normalize(sql, params)
            var rows = await runAll(statements)
        
            return rows
        }
        var normalize = function(sql, params) {
            var statements = sql
            if (typeof sql == 'string') {
                var statement = { sql:sql, params:[] }
                if (typeof params == 'object') {
                    statement.params = params
                }
                statements = [statement]
            }
            for (var i=0; i<statements.length; i++) {
                if (typeof statements[i] == 'string') {
                    statements[i] = {
                        sql:statements[i],
                        params:[]
                    }
                }
            }
            return statements
        }
        var runAll = async (statements)=>{
            var rows = []
            for (var i=0; i<statements.length; i++) {
                var statement = statements[i]
                var p = new Promise((resolve, reject)=>{
                    run(statement.sql, statement.params, function(rows, error) {
                        if (error) { reject(error); }
                        else { resolve(rows); }
                    })
                })
                rows = await p
            }
            return rows
        }
        var run = function(sql, params, callback) {
            var client = new pg.Client(config)
            client.connect(function(err) {
                if (err) { callback([], err); client.end(); return; }
                client.query(sql, params, function(err, result) {
                    if (err) { callback([], err); client.end(); return; }
                    client.end();
                    callback(result.rows);
                });
            });
        };
        
        var rows = await executeSync('select $1::text as name', ['Joe'])
        console.log(rows)
        expect(rows.length).to.equal(1)
        expect(rows[0].name).to.equal('Joe');
    })
})



