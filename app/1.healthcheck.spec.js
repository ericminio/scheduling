const { expect } = require('chai');
const request = require('./http/js/support/request');
const { Server } = require('./http/js/server');
const port = 8005;
const ping = {
    hostname: 'localhost',
    port: port,
    path: '/ping',
    method: 'GET'
};

describe('Server healthcheck', ()=>{

    let server;
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