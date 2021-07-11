const { executeSync } = require('yop-postgresql')
const fs = require('fs');
const path = require('path');

let contentOf = (name)=> {
    return fs.readFileSync(path.join(__dirname, name)).toString();
}

let run = async (file)=> {
    console.log('Running migration: ' + file);
    await executeSync(contentOf(file))
}

let migrate = async ()=> {
    await run('1.create-table-resources.sql');
    await run('2.create-table-events.sql');
    await run('3.create-table-events-resources.sql');
}


module.exports = migrate;