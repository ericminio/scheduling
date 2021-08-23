const { expect } = require('chai');
const { Server } = require('../../yop/server');
const { request, post } = require('../../support/request');
const RepositoryUsingMap = require('../../support/repository-using-map');
const { Resource, Event } = require('../../../domain');
const Factory = require('../../factory');
const CreateEventRoute = require('./create-one-event');
const port = 8007;
const creation = {
    hostname: 'localhost',
    port: port,
    path: '/data/events/create',
    method: 'POST'
};

describe('CreateEventRoute', ()=> {

    let server;
    let resourcesRepository;
    let eventsRepository;
    beforeEach((done)=>{
        server = new Server(port);
        server.start(done);
        eventsRepository = new RepositoryUsingMap();
        resourcesRepository = new RepositoryUsingMap();
        resourcesRepository.save(new Resource({ id:'R1', type:'type-1', name:'name-1' }));
        resourcesRepository.save(new Resource({ id:'R2', type:'type-2', name:'name-2' }));
        server.services= { 'resources': resourcesRepository, 'events': eventsRepository };
        server.factory = new Factory();
        server.routes = [new CreateEventRoute()];        
    });
    afterEach((done)=> {
        server.stop(done);
    });
    const payload = new Event({
        id: 'this-event',
        start: '2015-09-21 08:30',
        end: '2015-09-21 12:00',
        label: 'Bob',
        notes: 'birthday',
        resources: [{id:'R1'}, {id:'R2'}]
    });
    
    it('provides event creation', async ()=>{
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ location:'/data/events/this-event' });
        expect(response.statusCode).to.equal(201);
    });
    
    it('populates missing id', async ()=>{
        server.factory.idGenerator = { next: ()=> 42 };
        let response = await post(creation, new Event({
            start: '2015-09-21 08:30',
            end: '2015-09-21 12:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R1'}, {id:'R2'}]
        }));
        
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
        eventsRepository.save(new Event({
            id: 'this-event',
            start: '2015-09-21 11:00',
            end: '2015-09-21 15:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R2'}]
        }))
        let response = await post(creation, payload);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'Overbooking forbidden' });
        expect(response.statusCode).to.equal(403);
    });
    
    it('rejects event referencing unknown resource', async ()=>{
        let response = await post(creation, new Event({
            id: 'this-event',
            start: '2015-09-21 08:30',
            end: '2015-09-21 12:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'unknown'}]
        }));
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'unknown resource with id \"unknown\"' });
        expect(response.statusCode).to.equal(406);
    });

});