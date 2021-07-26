const Configuration = require('../domain/configuration');

class ConfigurationRepository {
    constructor(database) {
        this.database = database;
    }
    async get() {
        return new Configuration({
            title:'The world of Max'
        });
    }
}

module.exports = ConfigurationRepository;