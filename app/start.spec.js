const { expect } = require('chai');
const { User } = require('./domain');
const { Database, drop, migrate, UsersRepository } = require('./storage');
const Hash = require('./storage/hash');

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
        })

        it('is created', async ()=> {
            let user = await users.getUserByCredentials({ username:'admin', password:'admin' });

            expect(user).not.to.equal(undefined);
            expect(user.privileges).to.equal('read, write');
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

})