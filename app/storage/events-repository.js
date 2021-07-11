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
        if (! await this.exists(event.id)) {
            await executeSync('insert into events(id, label, start_utc, end_utc) values($1, $2, $3, $4)', 
                [event.getId(), event.getLabel(), event.getStart(), event.getEnd()]);
        }
        else {
            await executeSync(`update events set label=$2, start_utc=$3, end_utc=$4 where id=$1`, 
                [event.getId(), event.getLabel(), event.getStart(), event.getEnd()]);
        }
        let resources = event.getResources();
        for (let i=0; i<resources.length; i++) {
            let resource = resources[i];
            await this.resourcesRepository.save(resource);
        }
        await this.eventsResourcesRepository.deleteByEvent(event.getId());
        for (let i=0; i<resources.length; i++) {
            let resource = resources[i];
            await this.eventsResourcesRepository.add(event.getId(), resource.getId());
        }
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
    async exists(id) {
        let rows = await executeSync('select id from events where id=$1', [id]);
        return rows.length > 0;
    }
}

module.exports = EventsRepository;