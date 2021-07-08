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
                    { id:'E1', start:'11:30', end:'13:30', resources:['R1'], label:'Bob', line:0 },
                    { id:'E2', start:'15:00', end:'18:00', resources:['R1, R3'], label:'Joe', line:2 },
                    { id:'E3', start:'18:00', end:'20:00', resources:['R2', 'R3', 'R4'], label:'Alex', line:1 } 
                ]
            },
            'resources': {
                all: ()=> [
                    { id:'R1', type:'plane', name:'GITN' },
                    { id:'R2', type:'plane', name:'GNEA' },
                    { id:'R3', type:'headeset', name:'H1' },
                    { id:'R4', type:'headeset', name:'H2' },
                    { id:'R5', type:'headeset', name:'H3' }
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
                + fs.readFileSync(path.join(__dirname, 'views', 'resource.js')).toString()
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
        else if (request.url == '/data/resources') {
            let resources = this.services['resources'].all();
            body = JSON.stringify({ resources:resources });
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