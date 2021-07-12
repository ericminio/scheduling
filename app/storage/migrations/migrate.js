const fs = require('fs');
const path = require('path');
const Database = require('../database');

let contentOf = (name)=> {
    return fs.readFileSync(path.join(__dirname, name)).toString();
}

let database = new Database();

let run = async (file)=> {
    console.log('Running migration: ' + file);
    await database.executeSync(contentOf(file))
}

let migrate = async ()=> {
    await run('1.create-table-resources.sql');
    await run('2.create-table-events.sql');
    await run('3.create-table-events-resources.sql');
}


module.exports = migrate;