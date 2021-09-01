class DeleteResourceUsingPostgresql {
    constructor(database, cache) {
        this.database = database;
        this.cache = cache;
    }

    async please(resource) {
        return new Promise(async (resolve, reject)=> {
            try {
                await this.database.executeSync('delete from resources where id = $1', [resource.getId()]);
                this.cache.delete('all')
                resolve();
            }
            catch(error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = DeleteResourceUsingPostgresql;