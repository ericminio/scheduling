const Configuration = require('../domain/configuration');

class ConfigurationRepository {
    constructor(database) {
        this.database = database;
    }
    async save(configuration) {
        await this.saveOrUpdate(configuration, 'title');
        await this.saveOrUpdate(configuration, 'opening-hours');
    }
    async saveOrUpdate(configuration, key) {
        if (! await this.exists(key)) {
            await this.database.executeSync('insert into configuration(key, value) values($1, $2)',
                [key, configuration[key]]);
        } else {
            await this.database.executeSync('update configuration set value=$2 where key=$1',
                [key, configuration[key]]);
        }
    }
    async exists(key) {
        let rows = await this.database.executeSync('select key from configuration where key=$1', [key]);
        return rows.length > 0;
    }
    async get() {
        let rows = await this.database.executeSync('select key, value from configuration');
        let configuration = new Configuration({});
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            configuration[record.key] = record.value;
        }
        return configuration;
    }
}

module.exports = ConfigurationRepository;