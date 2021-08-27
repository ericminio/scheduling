class EventDeleteUsingPostgresql {
    constructor(database) {
        this.database = database;
    }

    async please(id) {
        return new Promise(async (resolve, reject)=> {
            try {
                await this.database.executeSync('delete from events_resources where event_id = $1', [id]);
                await this.database.executeSync('delete from events where id = $1', [id]);
                resolve();
            }
            catch(error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = EventDeleteUsingPostgresql;