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