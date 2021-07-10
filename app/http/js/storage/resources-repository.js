const { executeSync } = require('yop-postgresql')

class ResourcesRepository {
    constructor() {
    }
    async save(instance) {
        await executeSync('insert into resources(id, type, name) values($1, $2, $3)', [
            instance.id, instance.type, instance.name])
    }
    async get(id) {
        let rows = await executeSync('select type, name from resources where id=$1', [id]);
        let record = rows[0];
        return {
            id:id,
            type:record.type,
            name:record.name
        };
    }
    async all() {
        let rows = await executeSync('select id, type, name from resources');
        let collection = [];
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            collection.push({
                id:record.id,
                type:record.type,
                name:record.name
            })
        }
        return collection;
    }
}

module.exports = ResourcesRepository;