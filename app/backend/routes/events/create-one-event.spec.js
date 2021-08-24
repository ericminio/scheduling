const { expect } = require('chai');
const { Server } = require('../../yop/server');
const { post } = require('../../support/request');
const { Event, EventFactoryValidatingNeighbours } = require('../../../domain');
const CreateEventRoute = require('./create-one-event');
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
        route.eventFactory = { buildEvent: ()=> new Promise((resolve, reject)=> resolve(payload) ) };
    });
    afterEach((done)=> {
        server.stop(done);
    });

    it('is ready', ()=>{
        expect(new CreateEventRoute().eventFactory.buildEvent).not.to.equal(undefined);
    })
    
    it('provides event creation', async ()=>{
        eventsRepository.save = async (event)=> { event.id = 42; }
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ location:'/data/events/42' });
        expect(response.statusCode).to.equal(201);
    });
    
    it('stores incoming event', async ()=>{
        let spy;
        server.services['events'].save = (event)=> { spy = event; }
        await post(creation, payload);

        expect(spy.getLabel()).to.equal('Bob');
    });
    
    it('propagates factory errors', async ()=>{
        route.eventFactory.buildEvent = async (options)=> new Promise((resolve, reject)=> { reject({ message:'build failed' }) })
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'build failed' });
        expect(response.statusCode).to.equal(400);
    });
    
    it('propagates save errors', async ()=>{
        eventsRepository.save = async (event)=> { throw { message:'save failed' }; }
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'save failed' });
        expect(response.statusCode).to.equal(400);
    });

});