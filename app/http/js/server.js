let http = require('http');
let path = require('path');
let fs = require('fs');
const payload = require('./support/payload');

class Server {
    constructor(port) {
        this.port = port;
        this.internal = http.createServer(async (request, response)=>{
            try {
                await this.route(request, response);
            }
            catch (error) {
                console.log(error);
                response.setHeader('content-type', 'text/plain');
                response.statusCode = 500;
                response.end()
            }
        });
        this.sockets = [];
        this.services = {
            'resources': {
                all: ()=> [
                    { id:'R1', type:'plane', name:'GITN' },
                    { id:'R2', type:'plane', name:'GNEA' },
                    { id:'R3', type:'instructor', name:'Vasile' },
                    { id:'R4', type:'instructor', name:'Alain' },
                    { id:'R5', type:'instructor', name:'Eddy' },
                    { id:'R6', type:'headset', name:'Headset #1' },
                    { id:'R7', type:'headset', name:'Headset #2' },
                    { id:'R8', type:'headset', name:'Headset #3' },
                ]
            },
            'events': {
                all: ()=> [
                    { id:'E1', start:'2015-09-21 11:30', end:'2015-09-21 13:30', resources:['R1', 'R6', 'R7'], label:'Bob' },
                    { id:'E2', start:'2015-09-21 15:00', end:'2015-09-21 18:00', resources:['R1', 'R3'], label:'Joe' },
                    { id:'E3', start:'2015-09-21 18:00', end:'2015-09-21 20:00', resources:['R2', 'R4', 'R6'], label:'Alex' } 
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
    async route(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*');

        console.log(request.method, request.url)
        response.statusCode = 200;
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
        else if (request.method=='GET' && request.url == '/data/events') {
            let events = await this.services['events'].all();
            body = JSON.stringify({ events:events });
            response.setHeader('content-type', 'application/json');
        }
        else if (request.method=='GET' && request.url == '/data/resources') {
            let resources = await this.services['resources'].all();
            body = JSON.stringify({ resources:resources });
            response.setHeader('content-type', 'application/json');
        }
        else if (request.method=='POST' && request.url == '/data/resources/create') {
            let incoming = await payload(request);
            let id = await this.services['resources'].save(incoming);
            body = JSON.stringify({ location:'/data/resources/' + id });
            response.setHeader('content-type', 'application/json');
            response.statusCode = 201;
        }
        else if (request.method=='GET' && request.url.indexOf('/data/resources/')==0) {
            let id = request.url.substring('/data/resources/'.length);
            let instance = await this.services['resources'].get(id);
            body = JSON.stringify(instance);
            response.setHeader('content-type', 'application/json');
            response.statusCode = 200;
        }
        else if (request.method=='POST' && request.url == '/data/events/create') {
            let incoming = await payload(request);
            let id = await this.services['events'].save(incoming);
            body = JSON.stringify({ location:'/data/events/' + id });
            response.setHeader('content-type', 'application/json');
            response.statusCode = 201;
        }
        else if (request.method=='GET' && request.url.indexOf('/data/events/')==0) {
            let id = request.url.substring('/data/events/'.length);
            let instance = await this.services['events'].get(id);
            body = JSON.stringify(instance);
            response.setHeader('content-type', 'application/json');
            response.statusCode = 200;
        }
        else if (request.url.indexOf('/data/')==0) {
            response.statusCode = 404;
        }
        else {
            body = fs.readFileSync(path.join(__dirname, '..', 'index.html')).toString();
            response.setHeader('content-type', 'text/html');
        }
        // console.log('--> returning', body)
        response.setHeader('content-length', body.length);
        response.write(body);
        response.end();
    }
}

module.exports = {
    Server:Server
}