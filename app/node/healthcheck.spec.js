const { expect } = require('chai');
const { request } = require('./support/request');
const { Server } = require('./server');
const port = 8005;

describe('Server healthcheck', ()=>{

    let server;
    const ping = {
        hostname: 'localhost',
        port: port,
        path: '/ping',
        method: 'GET'
    };
    let pong;
    
    beforeEach((done)=>{
        server = new Server(port);
        server.start(async () => {
            pong = await request(ping);
            done();
        });
    });
    afterEach((done)=> {
        server.stop(done);
    })

    it('is available', ()=> {
        expect(pong.statusCode).to.equal(200);
    })

    it('returns json', ()=> {
        expect(pong.headers['content-type']).to.equal('application/json');
    })

    it('returns expected message', ()=> {
        expect(JSON.parse(pong.body)).to.deep.equal( { alive:true } );
    })
})