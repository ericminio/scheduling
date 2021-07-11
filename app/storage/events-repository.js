const { executeSync } = require('yop-postgresql')
const ResourcesRepository = require('./resources-repository');
const EventsResourcesRepository = require('./events-resources-repository');
const Event = require('../domain/event');

class EventsRepository {
    constructor() {
        this.resourcesRepository = new ResourcesRepository();
        this.eventsResourcesRepository = new EventsResourcesRepository();
    }
    async save(event) {
        await executeSync('insert into events(id, label, start_utc, end_utc) values($1, $2, $3, $4)', 
            [event.getId(), event.getLabel(), event.getStart(), event.getEnd()]);
        event.getResources().forEach(resource => this.resourcesRepository.save(resource));
        event.getResources().forEach(async resource => {
            await executeSync('insert into events_resources(event_id, resource_id) values($1, $2)',
                [event.getId(), resource.getId()])
        })
    }
    async get(id) {
        let rows = await executeSync('select label, start_utc, end_utc from events where id=$1', [id]);
        let record = rows[0];
        let event = new Event({
            id:id,
            label:record.label,
            start:record.start_utc,
            end:record.end_utc
        });
        event.setResources(await this.eventsResourcesRepository.getResourcesByEvent(id))
        return event;
    }
    async all() {
        let rows = await executeSync('select id, label, start_utc, end_utc from events');
        let collection = [];
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            let event = new Event({
                id:record.id,
                label:record.label,
                start:record.start_utc,
                end:record.end_utc
            });
            event.setResources(await this.eventsResourcesRepository.getResourcesByEvent(record.id))
            collection.push(event);
        }
        return collection;
    }
    async getResourcesByEvent(id) {
        
    }
}

module.exports = EventsRepository;