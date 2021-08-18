const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const jsdom = require("jsdom");
const { Resource, Event } = require('../../domain');
const { JSDOM } = jsdom;

describe('Calendar', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar-day></yop-calendar-day>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
                    api.getResources = ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve({ resources:[
                                new Resource({ id:'1', type:'plane', name:'GSDZ' }),
                                new Resource({ id:'2', type:'plane', name:'GKMY' }),
                                new Resource({ id:'3', type:'instructor', name:'Vasile' })
                            ] });
                        });
                    };
                    api.getEvents = ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve({ events:[
                                new Event({ id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] }),
                                new Event({ id:'15', start:'2015-09-21 19:30', end:'2015-09-21 23:30', resources:[{id:'2'}, {id:'3'}] })
                            ]});
                        });
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
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar-day');
        setTimeout(done, wait);
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    })
    it('displays expected resources', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('yop-calendar-day resources #resource-1')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day resources #resource-2')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day resources #resource-3')).not.to.equal(null);
            done();
        }, wait);
    })
    it('displays expected events', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('yop-calendar-day events #event-42-resource-1')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day events #event-15-resource-2')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day events #event-15-resource-3')).not.to.equal(null);
            done();
        }, wait);
    })
    it('listens to resource created event and refreshes', (done)=>{
        window.api.getResources = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ resources:[
                    new Resource({ id:'11', type:'plane', name:'GSDZ' })
                ]});
            });
        };
        window.api.getEvents = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ events:[
                    new Event({ id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] })
                ]});
            });
        };
        window.events.notify('resource created');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar-day resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
    it('listens to event created event and refreshes', (done)=>{
        window.api.getResources = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ resources:[
                    new Resource({ id:'11', type:'plane', name:'GSDZ' })
                ]});
            });
        };
        window.api.getEvents = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ events:[
                    new Event({ id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] })
                ]});
            });
        };
        window.events.notify('event created');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar-day resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
    it('listens to event deleted event and refreshes', (done)=>{
        window.api.getResources = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ resources:[
                    new Resource({ id:'11', type:'plane', name:'GSDZ' })
                ]});
            });
        };
        window.api.getEvents = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ events:[
                    new Event({ id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] })
                ]});
            });
        };
        window.events.notify('event deleted');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar-day resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
    it('listens to resource deleted event and refreshes', (done)=>{
        window.api.getResources = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ resources:[
                    { id:'11', type:'plane', name:'GSDZ' }
                ]});
            });
        };
        window.api.getEvents = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ events:[
                    new Event({ id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] })
                ]});
            });
        };
        window.events.notify('resource deleted');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar-day resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar-day events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
})