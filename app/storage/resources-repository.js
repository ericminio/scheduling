const { Resource } = require('../domain');
const EventsResourcesRepository = require('./events-resources-repository');

class ResourcesRepository {
    constructor(database) {
        this.database = database;
        this.eventsResourcesRepository = new EventsResourcesRepository(database);
    }
    async save(resource) {
        if (! await this.exists(resource.getId())) {
            await this.database.executeSync('insert into resources(id, type, name) values($1, $2, $3)', [
                resource.getId(), resource.getType(), resource.getName()]);
        }
        else {
            await this.database.executeSync('update resources set type=$2, name=$3 where id=$1', [
                resource.getId(), resource.getType(), resource.getName()]);
        }
    }
    async get(id) {
        let rows = await this.database.executeSync('select id, type, name from resources where id=$1 order by name', [id]);
        if (rows.length == 0) { return undefined; }
        let record = rows[0];
        return new Resource({
            id: record.id,
            type: record.type,
            name: record.name
        });
    }
    async all() {
        let rows = await this.database.executeSync('select id, type, name from resources order by type, name');
        let collection = [];
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            record.line = i;
            collection.push(new Resource({
                line: record.line,
                id: record.id,
                type: record.type,
                name: record.name
            }));
        }
        return collection;
    }
    async exists(id) {
        let rows = await this.database.executeSync('select id from resources where id=$1', [id]);
        return rows.length > 0;
    }
    async delete(id) {
        await this.eventsResourcesRepository.deleteByResource(id);
        await this.database.executeSync(`
            delete from events 
            where not exists (select 1 from events_resources where events_resources.event_id = events.id)`);
        await this.database.executeSync('delete from resources where id=$1', [id]);
    }
}

module.exports = ResourcesRepository;