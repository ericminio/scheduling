const { expect } = require('chai');
const { Server } = require('../../yop/server');
const { post } = require('../../support/request');
const { Resource } = require('../../../domain');
const CreateResourceRoute = require('./create-one-resource');
const port = 8007;
const creation = {
    hostname: 'localhost',
    port: port,
    path: '/data/resources/create',
    method: 'POST'
};

describe('CreateResourceRoute', ()=> {
    let route;
    let server;
    let payload;
    let shared;
    beforeEach((done)=>{
        route = new CreateResourceRoute({});
        server = new Server(port);
        server.routes = [route];        
        payload = new Resource({
            type: 'this type',
            name: 'this name'
        });
        route.createResource = {
            use: (adapters)=> { shared = adapters; },
            please: (incoming)=> new Promise((resolve, reject)=> { payload.id = 42; resolve(payload); } )
        };
        server.adapters = 'shared';
        server.start(done);
    });
    afterEach((done)=> {
        server.stop(done);
    });

    it('is ready', async ()=>{
        expect(new CreateResourceRoute({}).createResource).not.to.equal(undefined);
    })

    it('shares adapters', async ()=>{
        await post(creation, payload);

        expect(shared).to.equal('shared');
    });
    
    it('provides resource creation', async ()=>{
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ location:'/data/resources/42' });
        expect(response.statusCode).to.equal(201);
    });
    
    it('propagates errors', async ()=>{
        route.createResource.please = ()=> new Promise((resolve, reject)=> { reject({ message:'creation failed' }); } )
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'creation failed' });
        expect(response.statusCode).to.equal(400);
    });

});