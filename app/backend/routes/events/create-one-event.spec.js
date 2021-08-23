const { expect } = require('chai');
const { Server } = require('../../yop/server');
const { post } = require('../../support/request');
const { Event } = require('../../../domain');
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
    let resourcesRepository;
    let eventsRepository;
    let payload;
    beforeEach((done)=>{
        route = new CreateEventRoute();
        server = new Server(port);
        server.start(done);
        resourcesRepository = { get: async(id)=> true } ;
        eventsRepository = { save: async(event)=>{}, all: async()=> [] };
        server.services= { 'resources': resourcesRepository, 'events': eventsRepository };
        server.routes = [route];        
        payload = new Event({
            id: 'this-id',
            start: '2015-09-21 08:30',
            end: '2015-09-21 12:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R1'}, {id:'R2'}]
        });
    });
    afterEach((done)=> {
        server.stop(done);
    });
    
    it('provides event creation', async ()=>{
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ location:'/data/events/this-id' });
        expect(response.statusCode).to.equal(201);
    });
    
    it('populates missing id', async ()=>{
        delete payload.id;
        route.eventFactory.idGenerator = { next: ()=> 42 };
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
    
    it('rejects overbooking', async ()=>{
        eventsRepository.all = async () => [new Event({
            id: 'this-event',
            start: '2015-09-21 11:00',
            end: '2015-09-21 15:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R2'}]
        })]
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'Overbooking forbidden' });
        expect(response.statusCode).to.equal(400);
    });
    
    it('rejects event referencing unknown resource', async ()=>{
        resourcesRepository.get = async ()=> undefined
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'unknown resource with id \"R1\"' });
        expect(response.statusCode).to.equal(400);
    });

});