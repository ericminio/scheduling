let drop = async (database)=> {
    await database.executeSync('drop table if exists events_resources');
    await database.executeSync('drop table if exists resources');
    await database.executeSync('drop table if exists events');
}

module.exports = drop;