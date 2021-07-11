const { executeSync } = require('yop-postgresql')

class ResourcesRepository {
    constructor() {
    }
    async save(instance) {
        await executeSync('insert into events(id, label, start_utc, end_utc) values($1, $2, $3, $4)', [
            instance.id, instance.label, instance.start, instance.end])
    }
    async get(id) {
        let rows = await executeSync('select label, start_utc, end_utc from events where id=$1', [id]);
        let record = rows[0];
        return {
            id:id,
            label:record.label,
            start:record.start_utc,
            end:record.end_utc
        };
    }
    async all() {
        let rows = await executeSync('select id, label, start_utc, end_utc from events');
        let collection = [];
        for (let i=0; i<rows.length; i++) {
            let record = rows[i];
            collection.push({
                id:record.id,
                label:record.label,
                start:record.start_utc,
                end:record.end_utc
            })
        }
        return collection;
    }
}

module.exports = ResourcesRepository;