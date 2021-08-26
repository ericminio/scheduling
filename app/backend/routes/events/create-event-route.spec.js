const { expect } = require('chai');
const { Server } = require('../../yop/server');
const { post } = require('../../support/request');
const { Event } = require('../../../domain');
const CreateEventRoute = require('./create-event-route');
const port = 8007;
const creation = {
    hostname: 'localhost',
    port: port,
    path: '/data/events/create',
    method: 'POST'
};

describe('CreateEventRoute', ()=> {
    let route;
    let server;
    let eventsRepository;
    let payload;
    beforeEach((done)=>{
        route = new CreateEventRoute();
        server = new Server(port);
        server.start(done);
        eventsRepository = { save: async(event)=>{} };
        server.services= { 'events': eventsRepository };
        server.routes = [route];        
        payload = new Event({
            start: '2015-09-21 08:30',
            end: '2015-09-21 12:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R1'}, {id:'R2'}]
        });
        route.createEvent.please = ()=> new Promise((resolve, reject)=> { payload.id = 42; resolve(payload); } )
    });
    afterEach((done)=> {
        server.stop(done);
    });
    
    it('provides event creation', async ()=>{
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ location:'/data/events/42' });
        expect(response.statusCode).to.equal(201);
    });
    
    it('propagates errors', async ()=>{
        route.createEvent.please = ()=> new Promise((resolve, reject)=> { reject({ message:'creation failed' }); } )
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'creation failed' });
        expect(response.statusCode).to.equal(400);
    });

});