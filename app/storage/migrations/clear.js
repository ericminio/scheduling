const { executeSync } = require('yop-postgresql')

let clear = async ()=> {
    await executeSync('truncate table events_resources');
    await executeSync('truncate table resources');
    await executeSync('truncate table events');
}

module.exports = clear;