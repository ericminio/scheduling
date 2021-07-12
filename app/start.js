const { Database, ResourcesRepository, EventsRepository } = require('./storage');
let database = new Database();

const { Server } = require('./http/js/server');
const port = process.env.PORT || 8015;
let server = new Server(port);
server.services = {
    'resources': new ResourcesRepository(database),
    'events': new EventsRepository(database)
};


const { migrate } = require('./storage')
new Promise(async (resolve, reject)=> {
    try {
        await migrate();
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

module.exports = server