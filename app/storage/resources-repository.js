const { executeSync } = require('yop-postgresql');
const Resource = require('../domain/resource');

class ResourcesRepository {
    constructor() {
    }
    async save(resource) {
        await executeSync('insert into resources(id, type, name) values($1, $2, $3)', [
            resource.id, resource.type, resource.name])
    }
    async get(id) {
        let rows = await executeSync('select type, name from resources where id=$1', [id]);
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
}

module.exports = ResourcesRepository;