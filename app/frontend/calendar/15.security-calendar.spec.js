const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('When resource load fails', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar-day></yop-calendar-day>
                <script>
                    ${yop}
                    ${domain}
                    ${data}
                    var api = {
                        getResources: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ resources:[
                                    { id:'1', type:'plane', name:'GSDZ' },
                                    { id:'2', type:'plane', name:'GKMY' },
                                    { id:'3', type:'instructor', name:'Vasile' }
                                ]});
                            });
                        },
                        getEvents: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[
                                    new Event({ id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] }),
                                    new Event({ id:'15', start:'2015-09-21 19:30', end:'2015-09-21 23:30', resources:[{id:'2'}, {id:'3'}] })
                                ]});
                            });
                        }                        
                    };
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;
    let wait = 10;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost/calendar', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar-day');
        setTimeout(done, wait);
    });

    it('deletes locally stored resources', (done)=>{
        window.api.getResources = ()=> {
            return new Promise((resolve, reject)=>{
                reject();
            });
        };
        window.events.notify('resource created');
        setTimeout(()=>{
            expect(window.store.getObject('resources')).to.equal(null);
            done();
        }, wait);
    });

    it('may be because we are signed out', (done)=> {
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'maybe signed-out');
        window.api.getResources = ()=> {
            return new Promise((resolve, reject)=>{
                reject();
            });
        };
        window.events.notify('resource created');
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, wait);
    })
})