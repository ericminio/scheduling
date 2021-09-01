const { expect } = require('chai');
const { DeleteResourceRoute } = require('..');
const { Server } = require('../../yop/server');
const { request } = require('../../support/request');
const port = 8007;
const deletion = {
    hostname: 'localhost',
    port: port,
    path: '/data/resources/42',
    method: 'DELETE'
};

describe('DeleteResourceRoute', ()=> {
    let route;
    let server;
    let shared;
    beforeEach((done)=>{
        route = new DeleteResourceRoute();
        server = new Server(port);
        server.routes = [route];
        route.deleteResource.use = (adapters)=> { shared = adapters; }
        route.deleteResource.please = (resource)=> new Promise((resolve, reject)=> { resolve(resource.getId()); } )        
        server.adapters = 'shared';
        server.start(done);
    });
    afterEach((done)=> {
        server.stop(done);
    });

    it('shares adapters', async ()=>{
        await request(deletion);

        expect(shared).to.equal('shared');
    });

    it('provides resource deletion', async ()=>{
        let response = await request(deletion);
        
        expect(response.body).to.equal(JSON.stringify({ message:'Resource deleted' }));
        expect(response.headers['content-type']).to.equal('application/json');
        expect(response.statusCode).to.equal(200);
    });
    
    it('propagates errors', async ()=>{
        route.deleteResource.please = ()=> new Promise((resolve, reject)=> { reject({ message:'deletion failed' }); } )
        let response = await request(deletion);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'deletion failed' });
        expect(response.statusCode).to.equal(400);
    });
})