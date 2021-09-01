const { expect } = require('chai');
const { GetAllResources } = require('..');
const { Server } = require('../../yop/server');
const { request } = require('../../support/request');
const { Resource } = require('../../../domain');
const port = 8007;
const all = {
    hostname: 'localhost',
    port: port,
    path: '/data/resources',
    method: 'GET'
};

describe('GetResourcesRoute', ()=> {
    let route;
    let server;
    let shared;
    beforeEach((done)=>{
        route = new GetAllResources();
        server = new Server(port);
        server.routes = [route];
        route.getResources.use = (adapters)=> { shared = adapters; }
        route.getResources.please = ()=> new Promise((resolve, reject)=> { resolve([ new Resource({ id:15 })]); } )        
        server.adapters = 'shared';
        server.start(done);
    });
    afterEach((done)=> {
        server.stop(done);
    });

    it('shares adapters', async ()=>{
        await request(all);

        expect(shared).to.equal('shared');
    });

    it('returns resources', async ()=>{
        let response = await request(all);
        
        expect(response.body).to.equal(JSON.stringify({ resources:[ new Resource({ id:15 })] }));
        expect(response.headers['content-type']).to.equal('application/json');
        expect(response.statusCode).to.equal(200);
    });
    
    it('propagates errors', async ()=>{
        route.getResources.please = ()=> new Promise((resolve, reject)=> { reject({ message:'fetch failed' }); } )
        let response = await request(all);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'fetch failed' });
        expect(response.statusCode).to.equal(400);
    });
})