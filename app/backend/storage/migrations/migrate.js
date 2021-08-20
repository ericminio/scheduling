const fs = require('fs');
const path = require('path');

let contentOf = (name)=> {
    return fs.readFileSync(path.join(__dirname, name)).toString();
}

let run = async (file, database)=> {
    console.log('Running migration: ' + file);
    await database.executeSync(contentOf(file))
}

let migrate = async (database)=> {
    await run('1.create-table-resources.sql', database);
    await run('2.create-table-events.sql', database);
    await run('3.create-table-events-resources.sql', database);
    await run('4.create-table-users.sql', database);
    await run('5.create-table-configuration.sql', database);
    await run('6.alter-table-events-add-notes.sql', database);
}


module.exports = migrate;