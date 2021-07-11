const { executeSync } = require('yop-postgresql')
const fs = require('fs');
const path = require('path');

let contentOf = (name)=> {
    return fs.readFileSync(path.join(__dirname, name)).toString();
}

let executeIgnoringErrors = async (file)=> {
    try {
        await executeSync(contentOf(file))
    }
    catch (ignored) { console.log(ignored); }
}

let migrate = async ()=> {
    await executeIgnoringErrors('1.create-table-resources.sql');
    await executeIgnoringErrors('1.create-table-events.sql');
}


module.exports = {
    migrate:migrate
};