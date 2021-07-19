const { expect } = require('chai');
const { Server } = require('../../node/server');
const port = 8006;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let window = new JSDOM(`<html></html>`).window;
global.window = window;
global.window.fetch = (uri, options)=> {
    return new Promise((resolve, reject)=> {
        var xhr = new window.XMLHttpRequest();
        xhr.open(options.method, 'http://localhost:'+port + uri, true);
        xhr.onload = function() {
            if (xhr.readyState == xhr.DONE) {
                try {
                    let body = JSON.parse(xhr.responseText);
                    let response = {
                        json: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve(body);
                            })
                        }
                    }
                    resolve(response);
                    xhr = null;
                }
                catch (error) {
                    reject(error);
                }
            }
        };
        if (options.body) { xhr.send(options.body); }
        else { xhr.send(); }
    });
};

let path = require('path');
let fs = require('fs');
let sut = fs.readFileSync(path.join(__dirname, 'api-client.js')).toString();
let api = (new Function(sut + ' return api;'))();

const RepositoryUsingMap = require('../../node/support/repository-using-map');
const { Resource } = require('../../domain');

describe.only('Api client', ()=>{

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

    it('exposes events', async()=> {
        server.services['events'] = {
            all: ()=> [
                { any:'value' },
                { any:'thing' }
            ]
        };
        let data = await api.getEvents()
        expect(data).to.deep.equal({ 
            events:[
                { any:'value' },
                { any:'thing' }
            ]
        });
    });

    it('exposes resources', async()=> {
        server.services['resources'] = {
            all: ()=> [
                { any:'value' },
                { any:'thing' }
            ]
        };
        let data = await api.getResources()
        expect(data).to.deep.equal({ 
            resources:[
                { any:'value' },
                { any:'thing' }
            ]
        });
    });

    it('exposes ping', async()=> {
        server.services['ping'] = {
            status: async ()=> { return { any:'value' }; }
        };
        let data = await api.ping()
        expect(data).to.deep.equal({ any:'value' });
    });

    it('exposes resource creation', async()=> {
        server.services['resources'] = {
            save: (incoming)=> { incoming.id = '42'; }
        };
        let data = await api.createResource({ type:'table', name:'window' });
        expect(data).to.deep.equal({ location:'/data/resources/42' });
    });

    it('exposes event creation', async()=> {
        server.services['resources'].save(new Resource({ id:'R1', type:'type-1', name:'name-1' }));
        server.services['resources'].save(new Resource({ id:'R2', type:'type-2', name:'name-2' }));
        server.services['events'] = {
            save: (incoming)=> { incoming.id = '15'; }
        };
        let data = await api.createEvent({ 
            id: 'this-event',
            start: '08:30',
            end: '12:00',
            label: 'Bob',
            resources: [{id:'R1'}, {id:'R2'}]
        });
        expect(data).to.deep.equal({ location:'/data/events/15' });
    });

    it('exposes event deletion', async ()=> {
        server.services['events'] = {
            get: (id)=> { return {id:id}; },
            delete: ()=> {}
        };
        let data = await api.deleteEvent({ id:'42' });
        expect(data).to.deep.equal({ message:'event deleted' });
    })
})