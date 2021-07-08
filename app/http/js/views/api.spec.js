const { expect } = require('chai');
const { Server } = require('../server');
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
let sut = fs.readFileSync(path.join(__dirname, 'api.js')).toString();
let api = (new Function(sut + ' return api;'))();

describe('Api client', ()=>{

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

    it('exposes events', async()=> {
        server.services['events'] = {
            all: ()=> [
                { id:'E1', start:'11:30', end:'13:30', resources:['GITN'], line:0 },
                { id:'E2', start:'15:00', end:'18:00', resources:['GITN', 'H1'], line:0 },
                { id:'E3', start:'18:00', end:'20:00', resources:['GNEA', 'H1', 'H2'], line:1 }
            ]
        };
        let data = await api.getEvents()
        expect(data).to.deep.equal({ events:[
            { id:'E1', start:'11:30', end:'13:30', resources:['GITN'], line:0 },
            { id:'E2', start:'15:00', end:'18:00', resources:['GITN', 'H1'], line:0 },
            { id:'E3', start:'18:00', end:'20:00', resources:['GNEA', 'H1', 'H2'], line:1 }
        ]});
    });

    it('exposes resources', async()=> {
        server.services['resources'] = {
            all: ()=> [
                { id:'1', type:'plane', name:'GSDZ' },
                { id:'2', type:'plane', name:'GKMY' }
            ]
        };
        let data = await api.getResources()
        expect(data).to.deep.equal({ resources:[
            { id:'1', type:'plane', name:'GSDZ' },
            { id:'2', type:'plane', name:'GKMY' }
        ]});
    });
})