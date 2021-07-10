const { executeSync } = require('yop-postgresql')

let drop = async ()=> {
    await executeSync('drop table if exists resources');
}

module.exports = {
    drop:drop
};