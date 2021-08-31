const NextUuid = require('./next-uuid');

class ResourceStoreUsingPostgresql {
    constructor(database) {
        this.database = database;
        this.idGenerator = new NextUuid();
    }

    async please(resource) {
        resource.id = this.idGenerator.next();
        
        return new Promise(async (resolve, reject)=> {
            try {
                await this.database.executeSync('insert into resources(id, type, name) values($1, $2, $3)', 
                    [resource.getId(), resource.getType(), resource.getName()]);

                console.log(resource);
                resolve(resource);
            }
            catch(error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = ResourceStoreUsingPostgresql;