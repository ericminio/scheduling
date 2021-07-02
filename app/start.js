const { Server } = require('./http/js/server');
const port = process.env.PORT || 8015;

let server = new Server(port);
server.start();

console.log('listening on port ', port);