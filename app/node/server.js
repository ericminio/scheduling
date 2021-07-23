let http = require('http');
let path = require('path');
let fs = require('fs');
const payload = require('./support/payload');
const Factory = require('../domain/factory');
const Guard = require('./guard');

class Server {
    constructor(port) {
        this.port = port;
        this.sockets = [];
        this.factory = new Factory();
        this.guard = new Guard();
        this.internal = http.createServer(async (request, response)=>{
            try {
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, DELETE');
                let isAuthorized = await this.guard.isAuthorized(request);
                if (isAuthorized) {
                    await this.route(request, response);
                }
                else {
                    response.statusCode = 403;
                    let body = JSON.stringify({ message: 'forbidden: insufficient privilege' });
                    response.setHeader('content-type', 'application/json');
                    response.write(body);
                    response.end();
                }
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
                'event-creation.js',
                'show-event.js',
                'show-resource.js',
                'sign-in.js',
                'error-message.js'
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
        
        else if (request.method=='POST' && request.url.indexOf('/sign-in')==0) {
            let incoming = await payload(request);
            let decoded = Buffer.from(incoming.encoded, 'base64').toString('ascii');
            let credentials = JSON.parse(decoded);
            let answer = await this.guard.connect(credentials);
            response.statusCode = answer.key !== undefined ? 200: 403;
            body = JSON.stringify({
                username: answer.username,
                key: answer.key
            });
            response.setHeader('content-type', 'application/json');
        }
        

        else if (request.method=='OPTIONS' && request.url.indexOf('/data/')==0) {
            response.statusCode = 200;
        }
        
        else if (request.method=='GET' && request.url == '/data/events') {
            let events = await this.services['events'].all();
            body = JSON.stringify({ events:events });
            response.setHeader('content-type', 'application/json');
        }
        else if (request.method=='POST' && request.url == '/data/events/create') {
            let incoming = await payload(request);
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
            if (instance) {
                body = JSON.stringify(instance);
                response.setHeader('content-type', 'application/json');
                response.statusCode = 200;
            } else {
                response.statusCode = 404;
            }
        }
        else if (request.method=='DELETE' && request.url.indexOf('/data/events/')==0) {
            let id = request.url.substring('/data/events/'.length);
            let instance = await this.services['events'].get(id);
            if (instance) {
                await this.services['events'].delete(id);
                body = JSON.stringify({ message:'event deleted' });
                response.setHeader('content-type', 'application/json');
                response.statusCode = 200;
            } else {
                response.statusCode = 404;
            }
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
            if (instance) {
                body = JSON.stringify(instance);
                response.setHeader('content-type', 'application/json');
                response.statusCode = 200;
            } else {
                response.statusCode = 404;
            }
        }
        else if (request.method=='DELETE' && request.url.indexOf('/data/resources/')==0) {
            let id = request.url.substring('/data/resources/'.length);
            let instance = await this.services['resources'].get(id);
            if (instance) {
                await this.services['resources'].delete(id);
                body = JSON.stringify({ message:'resource deleted' });
                response.setHeader('content-type', 'application/json');
                response.statusCode = 200;
            } else {
                response.statusCode = 404;
            }
        }

        else if (request.url.indexOf('/data/')==0) {
            response.statusCode = 501;
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