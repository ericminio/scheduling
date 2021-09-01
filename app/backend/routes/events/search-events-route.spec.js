const { expect } = require('chai');
const { SearchEventsRoute } = require('..');
const { Server } = require('../../../../yop/node/server');
const { request } = require('../../support/request');
const { Event } = require('../../../domain');
const port = 8007;
const search = {
    hostname: 'localhost',
    port: port,
    path: '/data/events?from=2015-07-01%2000%3A00%3A00&to=2015-07-02%2000%3A00%3A00',
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
                inRange(start, end) { 
                    return new Promise((resolve, reject)=>{
                        resolve([ new Event({ 
                            id: 42,
                            start: 'ignored',
                            end: 'ignored',
                            notes: 'ignored',
                            resources: [],
                            label: `received start:${start}, end:${end}`
                        }) ]);
                     }); 
                } 
            }
        };
        server.routes = [route]; 
    });
    afterEach((done)=> {
        server.stop(done);
    });

    describe('matching', ()=> {

        it('accepts url with expected fields and values', ()=> {
            expect(route.matchesUrl(search.path)).to.equal(true);
        });
        it('accepts url with expected fields', ()=> {
            expect(route.matchesUrl('/data/events?from=any&to=any')).to.equal(true);
        });
        it('rejects url with missing to', ()=> {
            expect(route.matchesUrl('/data/events?from=any')).to.equal(false);
        });
        it('rejects url with missing from', ()=> {
            expect(route.matchesUrl('/data/events?to=any')).to.equal(false);
        });
        it('rejects url with empty to', ()=> {
            expect(route.matchesUrl('/data/events?from=any&to=')).to.equal(false);
        });
        it('rejects url with empty from', ()=> {
            expect(route.matchesUrl('/data/events?from=&to=any')).to.equal(false);
        });
    });

    it('provides event search', (done)=>{
        request(search)
            .then(response => {
                expect(response.statusCode).to.equal(200);        
                expect(response.headers['content-type']).to.equal('application/json');
                expect(JSON.parse(response.body)).to.deep.equal({ events:[new Event({
                    id: 42,
                    start: 'ignored',
                    end: 'ignored',
                    notes: 'ignored',
                    resources: [],
                    label: 'received start:2015-07-01 00:00:00, end:2015-07-02 00:00:00'
                })] });
                done();
            })
            .catch(error => done(error))
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

    it('propagates parse errors', (done)=>{
        let search = {
            hostname: 'localhost',
            port: port,
            path: '/data/events?from=2015-07-01 00%3A00%3A00&to=2015-07-02%2000%3A00%3A00',
            method: 'GET'
        };
        request(search)
            .then(response => {
                done('should fail');
            })
            .catch(error => {
                try {
                    expect(error.message).to.equal('Request path contains unescaped characters');
                    done();
                }
                catch(raised) {
                    done(raised);
                }
            });
    });
})