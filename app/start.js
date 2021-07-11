let connectionString = {
    PGHOST: process.env.PGHOST,
    PGDATABASE: process.env.PGDATABASE,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    DATABASE_URL: process.env.DATABASE_URL
};
console.log('connection string', connectionString);

const { Server } = require('./http/js/server');
const port = process.env.PORT || 8015;
let server = new Server(port);

const { migrate } = require('./storage')
new Promise(async (resolve, reject)=> {
    try {
        await migrate();
        resolve();
    }
    catch(error) { reject(error); }
}).then(()=>{
    server.start();
    console.log('\nlistening on port ', port);
}).catch((error)=>{
    console.log(error);
    process.exit(1);
});

module.exports = server