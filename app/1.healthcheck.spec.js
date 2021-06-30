const { expect } = require('chai');
const { Server } = require('./http/server');
const http = require('http');
const port = 8005;
const ping = {
    hostname: 'localhost',
    port: port,
    path: '/ping',
    method: 'GET'
};

describe('Server healthcheck', ()=>{

    let server;

    beforeEach((done)=>{
        server = new Server(port);
        server.start(done);
    });
    afterEach((done)=> {
        server.stop(done);
    })

    it('is available', (done)=> {
        let request = http.request(ping, response => {
            expect(response.statusCode).to.equal(200);
            done();
        });
        request.on('error', error => {
            console.error(error)
            done(error);
        })
        request.end();
    })

    it('returns json', (done)=> {
        let request = http.request(ping, response => {
            expect(response.headers['content-type']).to.equal('application/json');
            done();
        });
        request.on('error', error => {
            console.error(error)
            done(error);
        })
        request.end();
    })

    it('returns expected message', (done)=> {
        let request = http.request(ping, response => {
            let body = '';
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', ()=>{
                let message = JSON.parse(body);
                expect(message).to.deep.equal({ alive:true });
                done();
            });
        });
        request.on('error', error => {
            console.error(error)
            done(error);
        })
        request.end();
    })
})