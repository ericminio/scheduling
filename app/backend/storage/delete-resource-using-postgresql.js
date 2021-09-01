class DeleteResourceUsingPostgresql {
    constructor(database, cache) {
        this.database = database;
        this.cache = cache;
    }

    async please(resource) {
        return new Promise(async (resolve, reject)=> {
            try {
                await this.database.executeSync('delete from events_resources where resource_id=$1', [resource.getId()]);
                await this.database.executeSync(`delete from events 
                                                 where not exists (
                                                    select 1 from events_resources where events_resources.event_id = events.id
                                                 )`);
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