const { expect } = require('chai');
const { Server } = require('./server');
const http = require('http');
const port = 8005;
const request = (options)=> {
    return new Promise((resolve, reject)=>{
        let request = http.request(options, pong => {
            let body = '';
            pong.on('data', chunk => {
                body += chunk;
            });
            pong.on('end', ()=>{
                pong.body = body;
                resolve(pong)
            });
            pong.on('error', error => {
                reject(error);
            })
        })
        request.on('error', error => {
            reject(error);
        })
        request.end();
    })
}
describe('Server', ()=>{

    let server;

    beforeEach((done)=>{
        server = new Server(port);
        server.start(async () => {
            done();
        });
    });
    afterEach((done)=> {
        server.stop(done);
    })

    it('can serve javascript', async ()=> {
        const file = {
            hostname: 'localhost',
            port: port,
            path: '/calendar.js',
            method: 'GET'
        };
        let response = await request(file);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/javascript');
        expect(response.body).to.contain('class Calendar extends HTMLElement');
    })
    it('can serve css', async ()=> {
        const file = {
            hostname: 'localhost',
            port: port,
            path: '/scheduling.css',
            method: 'GET'
        };
        let response = await request(file);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('text/css');
        expect(response.body).to.contain('events {');
    })
})