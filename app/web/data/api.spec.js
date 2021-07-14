const { expect } = require('chai');
const { Server } = require('../../node/server');
const port = 8006;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let window = new JSDOM(`<html></html>`).window;
global.window = window;
global.window.fetch = (uri)=> {
    return new Promise((resolve, reject)=> {
        var xhr = new window.XMLHttpRequest();
        xhr.open('GET', 'http://localhost:'+port + uri, true);
        xhr.onload = function() {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
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
        xhr.send();
    });
}

let path = require('path');
let fs = require('fs');
let sut = fs.readFileSync(path.join(__dirname, 'api-client.js')).toString();
let api = (new Function(sut + ' return api;'))();

const RepositoryUsingMap = require('../../node/support/repository-using-map');

describe('Api client', ()=>{

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
})