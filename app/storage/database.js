const { URL } = require('url');
var pg = require('pg');

class Database {

    constructor() {
        const databaseUrl = process.env.DATABASE_URL;
        console.log('DATABASE_URL', databaseUrl);
        let url = new URL(databaseUrl)
        this.config = {
            user: url.username,
            password: url.password,
            host: url.hostname,
            port: url.port,
            database: url.pathname.split('/')[1]
        };
    }

    async executeSync(sql, params) {
        var statements = this.normalize(sql, params);
        var rows = await this.runAll(statements);
    
        return rows;
    }

    normalize(sql, params) {
        var statements = sql;
        if (typeof sql == 'string') {
            var statement = { sql:sql, params:[] };
            if (typeof params == 'object') {
                statement.params = params;
            }
            statements = [statement];
        }
        for (var i=0; i<statements.length; i++) {
            if (typeof statements[i] == 'string') {
                statements[i] = {
                    sql:statements[i],
                    params:[]
                };
            }
        }
        return statements
    }

    async runAll(statements) {
        var rows = [];
        for (var i=0; i<statements.length; i++) {
            var statement = statements[i];
            var p = new Promise((resolve, reject)=>{
                this.run(statement.sql, statement.params, function(rows, error) {
                    if (error) { reject(error); }
                    else { resolve(rows); }
                })
            })
            rows = await p;
        }
        return rows;
    }

    run(sql, params, callback) {
        var client = new pg.Client(this.config);
        client.connect(function(err) {
            if (err) { callback([], err); client.end(); return; }
            client.query(sql, params, function(err, result) {
                if (err) { callback([], err); client.end(); return; }
                client.end();
                callback(result.rows);
            });
        });
    };
}

module.exports = Database;