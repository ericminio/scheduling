let drop = async (database)=> {
    await database.executeSync('drop table if exists events_resources');
    await database.executeSync('drop table if exists resources');
    await database.executeSync('drop table if exists events');
    await database.executeSync('drop table if exists users');
    await database.executeSync('drop table if exists configuration');
}

module.exports = drop;