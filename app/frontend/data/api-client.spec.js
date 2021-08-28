const { JSDOM } = require("jsdom");
const { expect } = require('chai');
const { yop, domain, data } = require('../assets');
const { Server } = require('../../backend/yop/server');
const port = 8006;
const payload = require('../../backend/support/payload-raw')
const fetch = require('./custom-fetch');

describe('Api client', ()=>{

    let html = `
        <!DOCTYPE html><html lang="en"><body>
            <script>
                ${yop}
                ${domain}
                ${data}                
            </script>
        </body></html>`;
    let window;
    let wait = 10;
    let server;
    let http;
    
    beforeEach((done)=>{
        window = new JSDOM(html, { url:`http://localhost:${port}`, runScripts: "dangerously", resources: "usable"  }).window;
        setTimeout(()=>{
            window.store.saveObject('user', { user:'username', key:'any-key' });
            window.fetch = fetch(port);
            server = new Server(port);
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
            server.start(async () => {
                done();
            });
        }, wait);
    });
    afterEach((done)=> {
        server.stop(done);
    })

    it('exposes post service', (done)=> {
        window.api.post('/any', { any:42 })
            .then((data) => {
                expect(data).to.deep.equal({                     
                    method: 'POST',
                    url: '/any',
                    payload: JSON.stringify({ any:42 }),
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        'transfer-encoding': 'chunked',
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });

    it('exposes events', (done)=> {
        window.api.getEvents('2015-09-21')
            .then((data) => {
                expect(data).to.deep.equal({                     
                    method: 'GET',
                    url: '/data/events?date=2015-09-21',
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
        window.api.getResources()
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
        window.store.delete('user');
        window.api.ping()
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
        window.api.createResource({ type:'table', name:'window' })
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

    it('exposes event deletion', (done)=> {
        window.api.deleteEvent({ id:'42' })
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
        window.api.deleteResource({ id:'15' })
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
        window.api.signIn(credentials)
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
        window.events.register(spy, 'error');
        server.route = async (request, response)=> {
            response.setHeader('content-type', 'application/json');
            response.statusCode = 403;
            response.write(JSON.stringify({ 
                message: 'forbidden'
            }));
            response.end();
        };
        window.api.getEvents()
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
        window.store.delete('user');
        window.api.configuration()
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'GET',
                    url: '/data/configuration',
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

    it('exposes save configuration', (done)=> {
        window.api.saveConfiguration({ any:42 })
            .then((data) => {
                expect(data).to.deep.equal({ 
                    method: 'POST',
                    url: '/data/configuration',
                    payload: JSON.stringify({ any:42 }),
                    headers: {
                        connection: 'close',
                        host: 'localhost:8006',
                        'transfer-encoding': 'chunked',
                        'x-user-key': 'any-key'
                    }
                });            
                done();
            })
            .catch(error => done(error));
    });
})