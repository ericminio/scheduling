const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'resource.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'timeline-marker.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'event-creation.js')).toString()
    ;

describe('Event creation', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-calendar>
                <event-creation></event-creation>
                <script>
                    ${yop}
                    today = ()=> { return new Date(2015, 6, 1); }
                    var api = {
                        getResources: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ resources:[
                                    { id:'1', type:'plane', name:'GSDZ' }
                                ]});
                            });
                        },
                        getEvents: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[
                                    { id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] }                                    
                                ]});
                            });
                        },
                        createEvent: (payload)=> new Promise((resolve)=>{ resolve(); })  
                    };
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let form;
    let wait = 30;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        form = document.querySelector('#event-creation-form');
        setTimeout(done, wait);
    })

    it('is ready', ()=>{
        expect(form).not.to.equal(null);
    });

    it('is available via calendar click', (done)=> {
        let spy;
        window.events.register({ update:(value)=>{ spy=value; } }, 'event creation');
        document.querySelector('events').click(); 
        setTimeout(()=>{
            expect(spy).to.equal('2015-07-01');
            done();
        }, wait);
    });

    it('prepopulates start', ()=> {
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ])
        window.events.notify('event creation', '1980-05-25');

        expect(form.querySelector('#new-event-start').value).to.equal('1980-05-25 18:00');
    });

    it('prepopulates end', ()=> {
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ])
        window.events.notify('event creation', '1980-05-25');

        expect(form.querySelector('#new-event-end').value).to.equal('1980-05-25 20:00');
    });

    it('sends expected payload', ()=> {
        let spy = {};
        window.api = { createEvent:(payload)=> { spy = payload; return new Promise((resolve)=> { resolve(); })} }
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ])
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this label';
        form.querySelector('#new-event-start').value = 'this start';
        form.querySelector('#new-event-end').value = 'this end';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        expect(spy).to.deep.equal({
            label: 'this label',
            start: 'this start',
            end: 'this end',
            resources: [ { id:'two' }, { id:'three' } ]
        });
    });

    it('notifies on event created', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'event created');
        
        window.store.saveObject('resources', [{ id:'one', name:'one' }])
        window.events.notify('event creation');
        form.querySelector('#create-event').click();
        
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('does not send extra creation', ()=> {
        let spy = 0;
        window.api = { createEvent:()=> { spy ++; return new Promise((resolve)=> { resolve(); })} }
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ])
        window.events.notify('event creation');
        window.events.notify('event creation');
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'that label';
        form.querySelector('#new-event-start').value = 'that start';
        form.querySelector('#new-event-end').value = 'that end';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        expect(spy).to.equal(1);
    })
})