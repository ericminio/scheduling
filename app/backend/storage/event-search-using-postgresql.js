const collectionFrom = require('./event-collection-from-rows');

class EventSearchUsingPostgresql {
    constructor(database) {
        this.database = database;
    }

    async inRange(start, end) {
        let query = `
            select event_id, label, notes, start_time, end_time, resource_id 
            from events_resources, events
            where events_resources.event_id = events.id 
            and end_time > $1
            and start_time < $2
            order by event_id
        `;
        return new Promise(async (resolve, reject)=> {
            let rows = await this.database.executeSync(query, [start, end]);
            resolve(collectionFrom(rows));
        });
    }
};

module.exports = EventSearchUsingPostgresql;