const { Event } = require('../../domain');

module.exports = (rows)=> {
    let collection = [];
    let currentId = -1;
    let currentEvent;
    for (let i=0; i<rows.length; i++) {
        let record = rows[i];
        if (record.event_id != currentId) {
            currentId = record.event_id;
            currentEvent = new Event({
                id:record.event_id,
                label:record.label,
                notes:record.notes,
                start:record.start_time,
                end:record.end_time
            });
            currentEvent.resources = [];
            collection.push(currentEvent);
        }
        currentEvent.resources.push({ id:record.resource_id });
    }
    return collection;
}