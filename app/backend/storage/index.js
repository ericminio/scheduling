module.exports = {
    drop: require('./migrations/drop'),
    migrate: require('./migrations/migrate'),
    clear: require('./migrations/clear'),
    Database: require('./database'),
    ResourcesRepository: require('./resources-repository'),
    EventsRepository: require('./events-repository'),
    UsersRepository: require('./users-repository'),
    ConfigurationRepository: require('./configuration-repository'),
    EventSearchUsingPostgresql: require('./event-search-using-postgresql.js'),
    EventStoreUsingPostgresql: require('./event-store-using-postgresql.js'),
    EventDeleteUsingPostgresql: require('./event-delete-using-postgresql.js'),
    ResourceExistsUsingPostgresql: require('./resource-exists-using-postgresql.js'),
    ResourceStoreUsingPostgresql: require('./resource-store-using-postgresql.js')
}