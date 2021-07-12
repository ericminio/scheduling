const { Database } = require('..');

let clear = async ()=> {
    let database = new Database();
    await database.executeSync('truncate table events_resources');
    await database.executeSync('truncate table resources');
    await database.executeSync('truncate table events');
}

module.exports = clear;