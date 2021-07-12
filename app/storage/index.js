module.exports = {
    migrate: require('./migrations/migrate'),
    Database: require('./database'),
    ResourcesRepository: require('./resources-repository'),
    EventsRepository: require('./events-repository')
}