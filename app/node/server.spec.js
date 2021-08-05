const { expect } = require('chai');
const { request, post } = require('./support/request');
const { Server } = require('./server');
const port = 8005;
const RepositoryUsingMap = require('./support/repository-using-map');
const { Resource, Event, User, Configuration } = require('../domain');
const AlwaysSameId = require('./support/always-same-id');

describe('Server', ()=>{

    let server;

    beforeEach((done)=>{
        server = new Server(port);
        server.services = {
            'resources': new RepositoryUsingMap(),
            'events': new RepositoryUsingMap(),
            'users': new RepositoryUsingMap(),
            'configuration': new RepositoryUsingMap()
        };
        server.start(async () => {
            done();
        });
        server.guard.isAuthorized = ()=> { return true; }
        server.services['users'].getUserByCredentials = (credentials)=> new User(credentials)
        server.services['users'].saveKey = async (user)=> server.services['users'].save(user);
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
    it('answers to ping', async ()=> {
        const ping = {
            hostname: 'localhost',
            port: port,
            path: '/ping',
            method: 'GET'
        };
        let response = await request(ping);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ alive:true });
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
    it('is open to event deletion', async ()=>{
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

        const deletion = {
            hostname: 'localhost',
            port: port,
            path: '/data/events/this-event',
            method: 'DELETE'
        }
        response = await request(deletion);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'event deleted' });

        response = await request({
            hostname: 'localhost',
            port: port,
            path: '/data/events/this-event',
            method: 'GET'
        });
        expect(response.statusCode).to.equal(404);

        const all = {
            hostname: 'localhost',
            port: port,
            path: '/data/events',
            method: 'GET'
        }
        response = await request(all);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ events:[] });
    });
    it('is open to deleting all events', async ()=>{
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

        const deletion = {
            hostname: 'localhost',
            port: port,
            path: '/data/events',
            method: 'DELETE'
        }
        response = await request(deletion);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'events deleted' });

        response = await request({
            hostname: 'localhost',
            port: port,
            path: '/data/events/this-event',
            method: 'GET'
        });
        expect(response.statusCode).to.equal(404);

        const all = {
            hostname: 'localhost',
            port: port,
            path: '/data/events',
            method: 'GET'
        }
        response = await request(all);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ events:[] });
    });
    it('resists missing event deletion', async ()=>{
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

        const deletion = {
            hostname: 'localhost',
            port: port,
            path: '/data/events/this-event',
            method: 'DELETE'
        }
        await request(deletion);
        response = await request(deletion);
        expect(response.statusCode).to.equal(404);
    });
    it('is open to resource deletion', async ()=>{
        let repository = new RepositoryUsingMap();
        server.services['resources'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/create',
            method: 'POST'
        };
        await post(creation, { id:'this-id', type:'table', name:'by the fireplace'});

        const deletion = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/this-id',
            method: 'DELETE'
        }
        let response = await request(deletion);
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'resource deleted' });

        response = await request({
            hostname: 'localhost',
            port: port,
            path: '/data/resources/this-id',
            method: 'GET'
        });
        expect(response.statusCode).to.equal(404);

        const all = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources',
            method: 'GET'
        }
        response = await request(all);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ resources:[] });
    });
    it('resists missing resource deletion', async ()=>{
        let repository = new RepositoryUsingMap();
        server.services['resources'] = repository;
        const creation = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/create',
            method: 'POST'
        };
        await post(creation, { id:'this-id', type:'table', name:'by the fireplace'});

        const deletion = {
            hostname: 'localhost',
            port: port,
            path: '/data/resources/this-id',
            method: 'DELETE'
        }
        await request(deletion);
        let response = await request(deletion);
        
        expect(response.statusCode).to.equal(404);
    });
    it('is open to sign-in', async ()=>{
        server.routes[7].keyGenerator = new AlwaysSameId('42');
        let credentials = {
            username: 'this-username',
            password: 'this-password'
        };
        let encoded = window.btoa(JSON.stringify(credentials));
        const signin = {
            hostname: 'localhost',
            port: port,
            path: '/sign-in',
            method: 'POST'
        };
        let response = await post(signin, { encoded:encoded });
        
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({
            username: 'this-username',
            key: '42'
        });
    });
    it('is open to configuration update', async ()=> {
        let updateResponse = await post({
            hostname: 'localhost',
            port: port,
            path: '/data/configuration',
            method: 'POST'
        }, { title:'title', 'opening-hours':'8-18' });
        expect(updateResponse.statusCode).to.equal(200);
        expect(updateResponse.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(updateResponse.body)).to.deep.equal({ message:'configuration updated' });

        let getResponse = await request({
            hostname: 'localhost',
            port: port,
            path: '/data/configuration',
            method: 'GET'
        });
        expect(getResponse.statusCode).to.equal(200);
        expect(getResponse.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(getResponse.body)).to.deep.equal({ title:'title', 'opening-hours':'8-18' });
    });
    it('provides default configuration', async ()=> {
        server.services['configuration'].get = async()=> new Configuration({});
        let getResponse = await request({
            hostname: 'localhost',
            port: port,
            path: '/data/configuration',
            method: 'GET'
        });
        expect(getResponse.statusCode).to.equal(200);
        expect(getResponse.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(getResponse.body)).to.deep.equal({ title:'Yop', 'opening-hours':'0-24' });
    });
    it('is open to event search by date', async ()=>{
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
            start: '2015-10-01 08:30',
            end: '2015-10-01 12:00',
            label: 'Bob',
            resources: [{id:'R1'}, {id:'R2'}]
        };
        let response = await post(creation, payload);
        
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).location).to.equal('/data/events/this-event');
        let stored = await repository.get('this-event');
        expect(stored instanceof Event).to.equal(true);

        const search = {
            hostname: 'localhost',
            port: port,
            path: '/data/events?date=2015-10-01',
            method: 'GET'
        }
        response = await request(search);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ events:[payload] });
    });
})