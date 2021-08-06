const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, '../../domain/configuration.js')).toString()
    + fs.readFileSync(path.join(__dirname, '../data/data-reader.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'resource.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'timeline-marker.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar.js')).toString()
    ;

describe('Calendar', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-calendar>
                <script>
                    ${yop}
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
                                    { id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] },
                                    { id:'15', start:'2015-09-21 19:30', end:'2015-09-21 23:30', resources:[{id:'2'}, {id:'3'}] }
                                ]});
                            });
                        }                        
                    };
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;
    let wait = 20;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar');
        setTimeout(done, wait);
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    })
    it('displays expected resources', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('yop-calendar resources #resource-1')).not.to.equal(null);
            expect(document.querySelector('yop-calendar resources #resource-2')).not.to.equal(null);
            expect(document.querySelector('yop-calendar resources #resource-3')).not.to.equal(null);
            done();
        }, wait);
    })
    it('displays expected events', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('yop-calendar events #event-42-resource-1')).not.to.equal(null);
            expect(document.querySelector('yop-calendar events #event-15-resource-2')).not.to.equal(null);
            expect(document.querySelector('yop-calendar events #event-15-resource-3')).not.to.equal(null);
            done();
        }, wait);
    })
    it('listens to resource created event and refreshes', (done)=>{
        window.api = {
            getResources: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ resources:[
                        { id:'11', type:'plane', name:'GSDZ' }
                    ]});
                });
            },
            getEvents: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ events:[
                        { id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] }
                    ]});
                });
            }                        
        };
        window.events.notify('resource created');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
    it('listens to event created event and refreshes', (done)=>{
        window.api = {
            getResources: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ resources:[
                        { id:'11', type:'plane', name:'GSDZ' }
                    ]});
                });
            },
            getEvents: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ events:[
                        { id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] }
                    ]});
                });
            }                        
        };
        window.events.notify('event created');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
    it('listens to event deleted event and refreshes', (done)=>{
        window.api = {
            getResources: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ resources:[
                        { id:'11', type:'plane', name:'GSDZ' }
                    ]});
                });
            },
            getEvents: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ events:[
                        { id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] }
                    ]});
                });
            }                        
        };
        window.events.notify('event deleted');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
    it('listens to resource deleted event and refreshes', (done)=>{
        window.api = {
            getResources: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ resources:[
                        { id:'11', type:'plane', name:'GSDZ' }
                    ]});
                });
            },
            getEvents: ()=> {
                return new Promise((resolve, reject)=>{
                    resolve({ events:[
                        { id:'422', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'11'}] }
                    ]});
                });
            }                        
        };
        window.events.notify('resource deleted');
        setTimeout(()=>{
            expect(document.querySelector('yop-calendar resources #resource-11')).not.to.equal(null);
            expect(document.querySelector('yop-calendar events #event-422-resource-11')).not.to.equal(null);
            done();
        }, wait);
    });
})