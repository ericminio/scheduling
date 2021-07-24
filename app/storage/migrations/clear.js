let clear = async (database)=> {
    await database.executeSync('truncate table events_resources');
    await database.executeSync('truncate table resources');
    await database.executeSync('truncate table events');
    await database.executeSync('truncate table users');
}

module.exports = clear;