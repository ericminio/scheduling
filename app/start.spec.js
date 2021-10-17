const { expect } = require('chai');
const { User } = require('./domain');
const { Database, drop, migrate, UsersRepository } = require('./backend/storage');
const Hash = require('./backend/storage/hash');
const { request } = require('./backend/support/request');

describe('start', ()=> {

    describe('when admin user should be created', ()=> {

        let hash;
        let server;
        let database;
        let users;
        beforeEach(async ()=> {
            database = new Database();
            await drop(database);
            await migrate(database);

            hash = new Hash();
            process.env.YOP_ADMIN_USERNAME = 'admin';
            process.env.YOP_ADMIN_PASSWORD = hash.encrypt('admin');
            let maybeLoaded = require.resolve('./start');
            delete require.cache[maybeLoaded];
            let start = require('./start');
            await start.ready;            
            server = start.server;
            users = server.services['users'];            
        });
        afterEach((done)=> {
            server.stop(done)
        });

        it('is created', async ()=> {
            let user = await users.getUserByCredentials({ username:'admin', password:'admin' });

            expect(user).not.to.equal(undefined);
        });

        it('is created with expected privileges', async ()=> {
            let user = await users.getUserByCredentials({ username:'admin', password:'admin' });

            expect(user.privileges).to.equal('read, write, configure');
        })
    });

    describe('when password of admin user is missing', ()=> {

        let hash;
        let server;
        let database;
        beforeEach(async ()=> {
            database = new Database();
            await drop(database);
            await migrate(database);

            hash = new Hash();
            process.env.YOP_ADMIN_USERNAME = 'admin';
            delete process.env.YOP_ADMIN_PASSWORD;
            let maybeLoaded = require.resolve('./start');
            delete require.cache[maybeLoaded];
            let start = require('./start');
            await start.ready;
            server = start.server;
        });
        afterEach((done)=> {
            server.stop(done)
        })

        it('is not created', async ()=> {
            let rows = await database.executeSync('select id from users');

            expect(rows.length).to.equal(0);
        })
    });

    describe('when username of admin user is missing', ()=> {

        let hash;
        let server;
        let database;
        beforeEach(async ()=> {
            database = new Database();
            await drop(database);
            await migrate(database);

            hash = new Hash();
            delete process.env.YOP_ADMIN_USERNAME;
            process.env.YOP_ADMIN_PASSWORD = hash.encrypt('admin');;
            let maybeLoaded = require.resolve('./start');
            delete require.cache[maybeLoaded];
            let start = require('./start');
            await start.ready;
            server = start.server;
        });
        afterEach((done)=> {
            server.stop(done)
        })

        it('is not created', async ()=> {
            let rows = await database.executeSync('select id from users');

            expect(rows.length).to.equal(0);
        })
    });

    describe('when user already exists', ()=> {

        let hash;
        let server;
        let database;
        let users;
        beforeEach(async ()=> {
            database = new Database();
            await drop(database);
            await migrate(database);
            let admin = new User({
                username: 'admin',
                password: 'secret'
            });
            let repository = new UsersRepository(database);
            await repository.save(admin);

            hash = new Hash();
            process.env.YOP_ADMIN_USERNAME = 'admin';
            process.env.YOP_ADMIN_PASSWORD = hash.encrypt('admin');;
            let maybeLoaded = require.resolve('./start');
            delete require.cache[maybeLoaded];
            let start = require('./start');
            await start.ready;
            server = start.server;
            users = server.services['users']; 
        });
        afterEach((done)=> {
            server.stop(done)
        })

        it('updates the password', async ()=> {
            let rows = await database.executeSync('select id from users');
            expect(rows.length).to.equal(1);

            let user = await users.getUserByCredentials({ username:'admin', password:'admin' });
            expect(user).not.to.equal(undefined);
        })
    });

    describe('healthcheck', () => {

        let hash;
        let server;
        let database;
        beforeEach(async ()=> {
            database = new Database();
            await drop(database);
            await migrate(database);

            hash = new Hash();
            process.env.YOP_ADMIN_USERNAME = 'admin';
            process.env.YOP_ADMIN_PASSWORD = hash.encrypt('admin');
            let maybeLoaded = require.resolve('./start');
            delete require.cache[maybeLoaded];
            let start = require('./start');
            await start.ready;            
            server = start.server;         
        });
        afterEach((done)=> {
            server.stop(done)
        });
        
        it('is available via /ping', async ()=>{
            const ping = {
                hostname: 'localhost',
                port: server.port,
                path: '/ping',
                method: 'GET'
            };
            let pong = await request(ping);

            expect(pong.statusCode).to.equal(200);
            expect(pong.headers['content-type']).to.equal('application/json');
            expect(JSON.parse(pong.body)).to.deep.equal( { alive:true } );
        });
    });
})