const { Database, ResourcesRepository, EventsRepository, UsersRepository } = require('./storage');
let database = new Database();

const { Server } = require('./node/server');
const port = process.env.PORT || 8015;
let server = new Server(port);
server.services['resources'] = new ResourcesRepository(database);
server.services['events'] = new EventsRepository(database);
server.services['users'] = new UsersRepository(database);

const { migrate } = require('./storage');
new Promise(async (resolve, reject)=> {
    try {
        await migrate(database);
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

module.exports = { server:server, database:database };