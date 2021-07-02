const { expect } = require('chai');
const request = require('./support/request');
const { Server } = require('./server');
const port = 8005;

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