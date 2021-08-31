const { Database, migrate,
        EventSearchUsingPostgresql, EventStoreUsingPostgresql, ResourceExistsUsingPostgresql,
        EventDeleteUsingPostgresql,
        ResourcesRepository, 
        UsersRepository, 
        ConfigurationRepository } = require('./backend/storage');
let database = new Database();

const { UsersService, ResourcesService } = require('./backend/services');

const { Server } = require('./backend/yop/server');
const port = process.env.PORT || 8015;
let server = new Server(port);
const { ResourceFactoryWithDependencies } = require('./domain');
const NextUuid = require('./backend/storage/next-uuid');
const Guard = require('./backend/guard');

server.resourceFactory = new ResourceFactoryWithDependencies();
server.resourceFactory.idGenerator = new NextUuid();
server.services = {};
server.guard = new Guard();

const YopCache = require('./backend/yop/yop-cache');
let resourcesCache = new YopCache();

server.services['resources'] = new ResourcesService(new ResourcesRepository(database), resourcesCache);
server.services['users'] = new UsersService(new UsersRepository(database));
server.services['configuration'] = new ConfigurationRepository(database);

server.adapters = { 
    searchEvents: new EventSearchUsingPostgresql(database),
    storeEvent: new EventStoreUsingPostgresql(database),
    deleteEvent: new EventDeleteUsingPostgresql(database),

    resourceExists: new ResourceExistsUsingPostgresql(database)
};
const { SecurityRoute,
    Yop, Scripts, Styles, 
    Ping, GetConfiguration, UpdateConfiguration,
    SignIn, 
    SearchEventsRoute, CreateEventRoute, DeleteOneEvent,
    GetAllResources, CreateOneResource, DeleteOneResource,
    NotImplemented, DefaultRoute } = require('./backend/routes');

server.routes = [ 
    new SecurityRoute(),
    new Yop(), new Scripts(), new Styles(), 
    new Ping(), new GetConfiguration(), new UpdateConfiguration(),
    new SignIn(),
    new SearchEventsRoute(), new CreateEventRoute(server.adapters), new DeleteOneEvent(),
    new GetAllResources(), new CreateOneResource(), new DeleteOneResource(),
    new NotImplemented(),
    new DefaultRoute()
];


const { User } = require('./domain');
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