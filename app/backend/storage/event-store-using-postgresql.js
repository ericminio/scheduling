const NextUuid = require('./next-uuid');

class EventStoreUsingPostgresql {
    constructor(database) {
        this.database = database;
        this.idGenerator = new NextUuid();
    }

    async please(event) {
        event.id = this.idGenerator.next();
        
        return new Promise(async (resolve, reject)=> {
            try {
                await this.database.executeSync('insert into events(id, label, notes, start_time, end_time) values($1, $2, $3, $4, $5)', 
                    [event.getId(), event.getLabel(), event.getNotes(), event.getStart(), event.getEnd()]);

                let resources = event.getResources();
                for (let i=0; i<resources.length; i++) {
                    let resource = resources[i];
                    await this.database.executeSync('insert into events_resources(event_id, resource_id) values($1, $2)', [event.id, resource.id]);
                }
                resolve(event);
            }
            catch(error) {
                reject({ message:error.message });
            }
        });
    }
};

module.exports = EventStoreUsingPostgresql;