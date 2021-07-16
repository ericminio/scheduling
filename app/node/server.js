let http = require('http');
let path = require('path');
let fs = require('fs');
const payload = require('./support/payload');
const Factory = require('../domain/factory');

class Server {
    constructor(port) {
        this.port = port;
        this.sockets = [];
        this.factory = new Factory();
        this.internal = http.createServer(async (request, response)=>{
            try {
                await this.route(request, response);
            }
            catch (error) {
                console.log(error);
                response.setHeader('content-type', 'text/plain');
                response.statusCode = 500;
                response.write('oops');
                response.end()
            }
        });
        this.services = {
            ping: { status: async ()=>{ return { alive:true }; } }
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
            let status = await this.services['ping'].status();
            body = JSON.stringify(status);
            response.setHeader('content-type', 'application/json');
        }
        else if (request.url == '/yop.js') {
            body = require('../web/yop');
            response.setHeader('content-type', 'application/javascript');
        }
        else if (request.url == '/scheduling.js') {
            let files = [
                'system-status.js',
                'header.js',
                'layout.js',
                'resource.js',
                'timeline-marker.js',
                'calendar-event.js',
                'calendar.js',
                'resource-creation.js',
                'event-creation.js'
            ];
            body = fs.readFileSync(path.join(__dirname, '../web/data', 'api-client.js')).toString();
            files.forEach((file)=> {
                body += fs.readFileSync(path.join(__dirname, '../web/components', file)).toString();
            })
            response.setHeader('content-type', 'application/javascript');
        }
        else if (request.url == '/scheduling.css') {
            body = fs.readFileSync(path.join(__dirname, '../web', 'scheduling.css')).toString();
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
            let resource = await this.factory.createResource(incoming);
            await this.services['resources'].save(resource);
            body = JSON.stringify({ location:'/data/resources/' + resource.id });
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
            console.log('incoming', incoming)
            try {
                let event = await this.factory.createEvent(incoming, this.services['resources']);
                await this.services['events'].save(event);
                body = JSON.stringify({ location:'/data/events/' + event.id });
                response.setHeader('content-type', 'application/json');
                response.statusCode = 201;
            }
            catch (error) {
                body = JSON.stringify({ message:error.message });
                response.setHeader('content-type', 'application/json');
                response.statusCode = 406;
            }
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
            body = fs.readFileSync(path.join(__dirname, '../web', 'index.html')).toString();
            response.setHeader('content-type', 'text/html');
        }
        // console.log('--> returning', body)
        response.write(body);
        response.end();
    }
}

module.exports = {
    Server:Server
}