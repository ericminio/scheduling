const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const { Server } = require('../../node/server');
const port = 8006;

const http = require('http');
const payload = require('../../node/support/payload-raw')

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let window = new JSDOM(`<html></html>`, { url:`http://localhost:${port}` }).window;
global.window = window;
window.toto = 'toto';
window.fetch = (uri, options)=> { 
    return new Promise((resolve, reject)=> {
        const please = {
            hostname: 'localhost',
            port: port,
            path: uri,
            method: options.method
        };
        let request = http.request(please, answer => {   
            let payload = '';
            answer.on('data', chunk => {
                payload += chunk;
            });
            answer.on('end', ()=>{
                let body = JSON.parse(payload);
                let response = {
                    status: answer.statusCode,
                    json: ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve(body);
                        })
                    }
                }
                resolve(response);
            });
            answer.on('error', error => {
                reject(error);
            })
        })
        request.on('error', error => {
            reject(error);
        })
        if (options.headers !== undefined) {
            request.setHeader('x-user-key', options.headers.get('x-user-key'));
        }
        if (options.body) { request.write(options.body); }
        request.end();
    });
};
let store = (new Function(fs.readFileSync(path.join(__dirname, '../yop/1.store.js')).toString() + ' return store;'))();
window.store = store;
let events = (new Function(fs.readFileSync(path.join(__dirname, '../yop/2.events.js')).toString() + ' return events;'))();
window.events = events;

const sut = fs.readFileSync(path.join(__dirname, 'api-client.js')).toString();
let api = (new Function(`return (window)=> { ${sut} return api; };`))()(window);

describe('Api client', ()=>{

    let server;

    beforeEach((done)=>{
        server = new Server(port);
        server.start(async () => {
            done();
        });
        server.route = async (request, response)=> {
            let body = await payload(request);
            response.statusCode = 200;
            response.write(JSON.stringify({ 
                method: request.method,
                url: request.url,
                payload: body,
                headers: request.headers
            }));
            response.end();
        }
        store.saveObject('user', { user:'username', key:'any-key' })        
    });
    afterEach((done)=> {
        server.stop(done);
    })

    it('exposes events', (done)=> {
        api.getEvents()
            .then((data) => {
                expect(data).to.deep.equal({                     
                    method: 'GET',
                    url: '/data/events',
                    payload: '',
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes resources', (done)=> {
        api.getResources()
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'GET',
                    url: '/data/resources',
                    payload: '',
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes ping even disconnected', (done)=> {
        store.delete('user');
        api.ping()
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'GET',
                    url: '/ping',
                    payload: '',
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes resource creation', (done)=> {
        api.createResource({ type:'table', name:'window' })
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'POST',
                    url: '/data/resources/create',
                    payload: JSON.stringify({ type:'table', name:'window' }),
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        "transfer-encoding": "chunked",
                        'x-user-key': 'any-key'
                    },
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes event creation', (done)=> {
        let event = { 
            id: 'this-event',
            start: '08:30',
            end: '12:00',
            label: 'Bob',
            resources: [{id:'R1'}, {id:'R2'}]
        };
        api.createEvent(event)
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'POST',
                    url: '/data/events/create',
                    payload: JSON.stringify(event),
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        "transfer-encoding": "chunked",
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes event deletion', (done)=> {
        api.deleteEvent({ id:'42' })
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'DELETE',
                    url: '/data/events/42',
                    payload: '',
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes resource deletion', (done)=> {
        api.deleteResource({ id:'15' })
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'DELETE',
                    url: '/data/resources/15',
                    payload: '',
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes sign in', (done)=> {
        let credentials = {
            username: 'this-username',
            password: 'this-password'
        };
        let encoded = window.btoa(JSON.stringify(credentials));
        api.signIn(credentials)
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'POST',
                    url: '/sign-in',
                    payload: JSON.stringify({ encoded:encoded }),
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        "transfer-encoding": "chunked",
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('notifies on error', (done)=> {
        let value = {};
        let spy = {
            update: (error)=> { value = error; }
        };
        events.register(spy, 'error');
        server.route = async (request, response)=> {
            response.setHeader('content-type', 'application/json');
            response.statusCode = 403;
            response.write(JSON.stringify({ 
                message: 'forbidden'
            }));
            response.end();
        };
        api.getEvents()
            .then(()=> done('should fail'))
            .catch((pointless)=> {
                try {
                    expect(pointless).to.equal(undefined);
                    expect(value).to.deep.equal({ message:'forbidden' });
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
    });

    it('exposes configuration even disconnected', (done)=> {
        store.delete('user');
        api.configuration()
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'GET',
                    url: '/configuration',
                    payload: '',
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });
})