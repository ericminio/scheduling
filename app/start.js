const { Database, migrate,
        ResourcesRepository, EventsRepository, UsersRepository } = require('./storage');
let database = new Database();

const { Server } = require('./node/server');
const port = process.env.PORT || 8015;
let server = new Server(port);
server.services['resources'] = new ResourcesRepository(database);
server.services['events'] = new EventsRepository(database);
server.services['users'] = new UsersRepository(database);

const User = require('./domain/user');
let ready = new Promise(async (resolve, reject)=> {
    try {
        await migrate(database);
        if (process.env.YOP_ADMIN_USERNAME !== undefined && 
            process.env.YOP_ADMIN_PASSWORD !== undefined) {
            let users = server.services['users'];
            let existing = await users.getUserByUsername(process.env.YOP_ADMIN_USERNAME);
            if (existing) {
                existing.password = process.env.YOP_ADMIN_PASSWORD;
                console.log('updating', existing);
                users.savePasswordAssumingAlreadyEncrypted(existing);
            } else {
                let admin = new User({
                    username: process.env.YOP_ADMIN_USERNAME,
                    password: process.env.YOP_ADMIN_PASSWORD,
                    privileges: 'read, write, configure'
                });
                console.log('creating', admin);
                await users.saveAssumingPasswordAlreadyEncrypted(admin);
            }
        }
        resolve();
    }
    catch(error) { reject(error); }
}).then(()=>{
    server.start();
    console.log('\nlistening on port ', port);
}).catch((error)=>{
    console.log(error);
    process.exit(1);
});

module.exports = { server:server, database:database, ready:ready };