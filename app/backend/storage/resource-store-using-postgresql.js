const NextUuid = require('./next-uuid');

class ResourceStoreUsingPostgresql {
    constructor(database, cache) {
        this.database = database;
        this.cache = cache;
        this.idGenerator = new NextUuid();
    }

    async please(resource) {
        resource.id = this.idGenerator.next();
        
        return new Promise(async (resolve, reject)=> {
            try {
                await this.database.executeSync('insert into resources(id, type, name) values($1, $2, $3)', 
                    [resource.getId(), resource.getType(), resource.getName()]);

                this.cache.delete('all')
                resolve(resource);
            }
            catch(error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = ResourceStoreUsingPostgresql;