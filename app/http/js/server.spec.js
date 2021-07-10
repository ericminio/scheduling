const { expect } = require('chai');
const { request, post } = require('./support/request');
const { Server } = require('./server');
const port = 8005;
const RepositoryUsingMap = require('./support/repository-using-map')

describe.only('Server', ()=>{

    let server;

    beforeEach((done)=>{
        server = new Server(port);
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
            path: '/all.js',
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
    it('is open to resource creation', async ()=>{
        server.services['resources'] = new RepositoryUsingMap();
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
        server.services['events'] = new RepositoryUsingMap();
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
            resources: ['R1', 'R2']
        };
        let response = await post(creation, payload);
        
        expect(response.statusCode).to.equal(201);
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body).location).to.equal('/data/events/this-event');

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
})