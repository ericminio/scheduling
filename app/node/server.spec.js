const { expect } = require('chai');
const { request, post } = require('./support/request');
const { Server } = require('./server');
const port = 8005;
const RepositoryUsingMap = require('./support/repository-using-map');
const { Resource, Event } = require('../domain');
const AlwaysSameId = require('./support/always-same-id');

describe('Server', ()=>{

    let server;

    beforeEach((done)=>{
        server = new Server(port);
        server.services = {
            'resources': new RepositoryUsingMap(),
            'events': new RepositoryUsingMap()
        };
        server.start(async () => {
            done();
        });
    });
    afterEach((done)=> {
        server.stop(done);
    })

    it('can serve javascript', async ()=> {
        const file = {
            hostname: 'localhost',
            port: port,
            path: '/scheduling.js',
            method: 'GET'
        };
        let response = await request(file);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/javascript');
        expect(response.body).to.contain('class Calendar extends HTMLElement');
    })
    it('can serve css', async ()=> {
        const file = {
            hostname: 'localhost',
            port: port,
            path: '/scheduling.css',
            method: 'GET'
        };
        let response = await request(file);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('text/css');
        expect(response.body).to.contain('events {');
    })
    it('can serve html', async ()=> {
        const file = {
            hostname: 'localhost',
            port: port,
            path: '/',
            method: 'GET'
        };
        let response = await request(file);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('text/html');
        expect(response.body).to.contain('<!DOCTYPE html>');
    })
    it('is open to resource creation', async ()=>{
        let repository = new RepositoryUsingMap();
        server.services['resources'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/create',
            method: 'POST'
        };
        let response = await post(creation, { id:'this-id', type:'table', name:'by the fireplace'});
        
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).location).to.equal('/data/resources/this-id');
        expect((await repository.get('this-id')) instanceof Resource).to.equal(true);

        const created = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/this-id',
            method: 'GET'
        }
        response = await request(created);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ id:'this-id', type:'table', name:'by the fireplace'});

        const all = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources',
            method: 'GET'
        }
        response = await request(all);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ resources:[{ id:'this-id', type:'table', name:'by the fireplace'}] });
    })
    it('is open to event creation', async ()=>{
        let resources = new RepositoryUsingMap();
        let r1 = new Resource({ id:'R1', type:'type-1', name:'name-1' });
        let r2 = new Resource({ id:'R2', type:'type-2', name:'name-2' });
        resources.save(r1);
        resources.save(r2);
        server.services['resources'] = resources;
        let repository = new RepositoryUsingMap();
        server.services['events'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/events/create',
            method: 'POST'
        };
        let payload = {
            id: 'this-event',
            start: '08:30',
            end: '12:00',
            label: 'Bob',
            resources: [{id:'R1'}, {id:'R2'}]
        };
        let response = await post(creation, payload);
        
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).location).to.equal('/data/events/this-event');
        let stored = await repository.get('this-event');
        expect(stored instanceof Event).to.equal(true);

        const created = {
            hostname: 'localhost',
            port: port,
            path: '/data/events/this-event',
            method: 'GET'
        }
        response = await request(created);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal(payload);

        const all = {
            hostname: 'localhost',
            port: port,
            path: '/data/events',
            method: 'GET'
        }
        response = await request(all);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ events:[payload] });
    });
    it('resists non-existing resource', async ()=>{
        let resources = new RepositoryUsingMap();
        resources.save(new Resource({ id:'I exist' }));
        server.services['resources'] = resources;
        let repository = new RepositoryUsingMap();
        server.services['events'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/events/create',
            method: 'POST'
        };
        let payload = {
            id: 'this-event',
            start: '08:30',
            end: '12:00',
            label: 'Bob',
            resources: [{ id:'unknown' }]
        };
        let response = await post(creation, payload);
        
        expect(response.statusCode).to.equal(406);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).message).to.equal('unknown resource with id "unknown"');
    });
    it('resists missing id for resource creation', async ()=>{
        server.factory.idGenerator = new AlwaysSameId('42');
        let repository = new RepositoryUsingMap();
        server.services['resources'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/create',
            method: 'POST'
        };
        let response = await post(creation, { type:'table', name:'by the fireplace'});
        
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).location).to.equal('/data/resources/42');
    })
    it('resists missing id for event creation', async ()=>{
        server.factory.idGenerator = new AlwaysSameId('15');
        let resources = new RepositoryUsingMap();
        let r1 = new Resource({ id:'R1', type:'type-1', name:'name-1' });
        let r2 = new Resource({ id:'R2', type:'type-2', name:'name-2' });
        resources.save(r1);
        resources.save(r2);
        server.services['resources'] = resources;
        let repository = new RepositoryUsingMap();
        server.services['events'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/events/create',
            method: 'POST'
        };
        let payload = {
            start: '08:30',
            end: '12:00',
            label: 'Bob',
            resources: [{id:'R1'}, {id:'R2'}]
        };
        let response = await post(creation, payload);
        
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).location).to.equal('/data/events/15');
    });
})