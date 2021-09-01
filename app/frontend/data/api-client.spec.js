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