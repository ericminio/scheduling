const { Server } = require('./http/server');
const port = 8015;

let server = new Server(port);
server.start();

console.log('listening on port ', port);