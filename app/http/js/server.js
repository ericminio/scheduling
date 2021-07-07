let http = require('http');
let path = require('path');
let fs = require('fs');

class Server {
    constructor(port) {
        this.port = port;
        this.internal = http.createServer((request, response)=>this.route(request, response));
        this.sockets = [];
        this.services = {
            'events': {
                all: ()=> [
                    { id:'E0', start:'00:00', end:'07:00', line:0 },
                    { id:'E1', start:'00:30', end:'07:00', line:1 },
                    { id:'E2', start:'01:00', end:'07:00', line:2 },
                    { id:'E3', start:'18:00', end:'20:00', line:0 },
                    { id:'E5', start:'08:00', end:'11:00', line:1 },
                    { id:'E6', start:'21:00', end:'24:00', line:1 } 
                ]
            }
        };
    }
    start(done) {
        this.internal.listen(this.port, done);
        this.internal.on('connection', (socket)=> {
            // console.log('socket connected');
            this.sockets.push(socket);
            socket.on('close', ()=> {
                // console.log('socket closed');
                this.sockets.splice(this.sockets.indexOf(socket), 1);
            });
        });
    }
    stop(done) {
        this.sockets.forEach(socket=> socket.destroy())
        this.internal.close(done);
    }
    route(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*');

        console.log(request.method, request.url)
        let body = 'NOT FOUND';

        if (request.url == '/ping') {
            body = JSON.stringify({alive:true});
            response.setHeader('content-type', 'application/json');
        }
        else if (request.url == '/all.js') {
            body = ''
                + fs.readFileSync(path.join(__dirname, 'views', 'api.js')).toString()
                + fs.readFileSync(path.join(__dirname, 'views', 'layout.js')).toString()
                + fs.readFileSync(path.join(__dirname, 'views', 'timeline-marker.js')).toString()
                + fs.readFileSync(path.join(__dirname, 'views', 'calendar-event.js')).toString()
                + fs.readFileSync(path.join(__dirname, 'views', 'calendar.js')).toString()
                ;
            response.setHeader('content-type', 'application/javascript');
        }
        else if (request.url == '/scheduling.css') {
            body = fs.readFileSync(path.join(__dirname, '..', 'css', 'scheduling.css')).toString();
            response.setHeader('content-type', 'text/css');
        }
        else if (request.url == '/data/events') {
            let events = this.services['events'].all();
            body = JSON.stringify({ events:events });
            response.setHeader('content-type', 'application/json');
        }
        else {
            body = fs.readFileSync(path.join(__dirname, '..', 'index.html')).toString();
            response.setHeader('content-type', 'text/html');
        }
        // console.log('--> returning', body)
        response.setHeader('content-length', body.length);
        response.write(body);
        response.statusCode = 200;
        response.end();
    }
}

module.exports = {
    Server:Server
}