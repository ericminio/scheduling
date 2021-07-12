const { Database } = require('..');

let drop = async ()=> {
    let database = new Database();
    await database.executeSync('drop table if exists events_resources');
    await database.executeSync('drop table if exists resources');
    await database.executeSync('drop table if exists events');
}

module.exports = {
    drop:drop
};