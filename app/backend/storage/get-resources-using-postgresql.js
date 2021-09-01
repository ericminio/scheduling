const { Resource } = require('../../domain');

class GetResourcesUsingPostgresql {
    constructor(database, cache) {
        this.database = database;
        this.cache = cache;
    }

    async please() {
        return new Promise(async (resolve, reject)=>{
            try {
                let collection = this.cache.get('all')
                if (collection === undefined) {
                    let rows = await this.database.executeSync('select id, type, name from resources order by type, name');
                    collection = [];
                    for (let i=0; i<rows.length; i++) {
                        let record = rows[i];
                        let resource = new Resource({
                            id: record.id,
                            type: record.type,
                            name: record.name
                        });
                        collection.push(resource);
                    }
                    this.cache.put('all', collection);
                }
                resolve(collection)
            }
            catch (error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = GetResourcesUsingPostgresql;