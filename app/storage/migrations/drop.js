const { executeSync } = require('yop-postgresql')

let drop = async ()=> {
    await executeSync('drop table if exists events_resources');
    await executeSync('drop table if exists resources');
    await executeSync('drop table if exists events');
}

module.exports = {
    drop:drop
};