const { executeSync } = require('yop-postgresql');
const Resource = require('../domain/resource');

class EventsResourcesRepository {
    constructor() {
    }
    async getResourcesByEvent(id) {
        let rows = await executeSync(`
            select id, type, name 
            from resources, events_resources 
            where events_resources.resource_id = resources.id 
                and event_id=$1
            order by name
            `, [id]);
        let collection = [];
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            collection.push(new Resource({
                id:record.id,
                type:record.type,
                name:record.name
            }));
        }
        return collection;
    }
    async deleteByEvent(id) {
        await executeSync('delete from events_resources where event_id=$1', [id]);
    }
    async add(eventId, resourceId) {
        await executeSync('insert into events_resources(event_id, resource_id) values($1, $2)', [eventId, resourceId]);
    }
}

module.exports = EventsResourcesRepository;