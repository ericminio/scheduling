const { expect } = require('chai');
const { SearchEventsRoute } = require('..');
const { Server } = require('../../yop/server');
const { request } = require('../../support/request');
const { Event } = require('../../../domain');
const port = 8007;
const search = {
    hostname: 'localhost',
    port: port,
    path: '/data/events?date=2015-09-21',
    method: 'GET'
};

describe('SearchEventsRoute', ()=> {
    let route;
    let server;
    beforeEach((done)=>{
        route = new SearchEventsRoute();
        server = new Server(port);
        server.start(done);
        server.adapters = {
            searchEvents: { 
                async inRange(start, end) { 
                    return new Promise((resolve, reject)=>{
                        resolve([new Event({
                            id: 42,
                            start: '2015-09-21 08:30',
                            end: '2015-09-21 12:00',
                            label: 'Bob',
                            notes: 'birthday',
                            resources: [{id:'R1'}, {id:'R2'}]
                        })]);
                     }); 
                } 
            }
        };
        server.routes = [route]; 
        route.eventFactory = { buildEvent: ()=> new Promise((resolve, reject)=> resolve(payload) ) };
    });
    afterEach((done)=> {
        server.stop(done);
    });

    it('provides event search', async ()=>{
        let response = await request(search);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ events:[new Event({
            id: 42,
            start: '2015-09-21 08:30',
            end: '2015-09-21 12:00',
            label: 'Bob',
            notes: 'birthday',
            resources: [{id:'R1'}, {id:'R2'}]
        })] });
        expect(response.statusCode).to.equal(200);
    });

    it('propagates search errors', async ()=>{
        server.adapters = {
            searchEvents: { 
                async inRange(start, end) { 
                    throw { message:'search failed' };
                } 
            }
        };
        let response = await request(search);
        
        expect(response.headers['content-type']).to.equal('application/json');
        expect(JSON.parse(response.body)).to.deep.equal({ message:'search failed' });
        expect(response.statusCode).to.equal(400);
    });
})