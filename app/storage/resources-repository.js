const { executeSync } = require('yop-postgresql');
const Resource = require('../domain/resource');

class ResourcesRepository {
    constructor() {
    }
    async save(resource) {
        if (! await this.exists(resource.getId())) {
            await executeSync('insert into resources(id, type, name) values($1, $2, $3)', [
                resource.getId(), resource.getType(), resource.getName()]);
        }
        else {
            await executeSync('update resources set type=$2, name=$3 where id=$1', [
                resource.getId(), resource.getType(), resource.getName()]);
        }
    }
    async get(id) {
        let rows = await executeSync('select type, name from resources where id=$1 order by name', [id]);
        let record = rows[0];
        return new Resource({
            id:id,
            type:record.type,
            name:record.name
        });
    }
    async all() {
        let rows = await executeSync('select id, type, name from resources');
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
    async exists(id) {
        let rows = await executeSync('select id from resources where id=$1', [id]);
        return rows.length > 0;
    }
}

module.exports = ResourcesRepository;