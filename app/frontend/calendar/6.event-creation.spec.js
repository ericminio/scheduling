const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe('Event creation', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-calendar>
                <event-creation></event-creation>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
                    today = ()=> { return new Date(2015, 6, 1); }
                    window.api.getResources = ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve({ resources:[
                                new Resource({ id:'1', type:'plane', name:'GSDZ' })
                            ]});
                        });
                    };
                    window.api.getEvents = ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve({ events:[
                                new Event({ id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] })
                            ]});
                        });
                    };
                    window.api.createEvent = (payload)=> new Promise((resolve)=>{ resolve(); })
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let form;
    let wait = 10;

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

        expect(form.querySelector('#new-event-start').value).to.equal('1980-05-25 08:00');
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
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        expect(spy).to.deep.equal({
            label: 'this label',
            start: '1980-05-25 08:00',
            end: '1980-05-25 10:00',
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
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
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
        form.querySelector('#new-event-label').value = 'this label';
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        expect(spy).to.equal(1);
    });

    it('alerts on invalid start datetime', ()=> {
        let spy;
        window.events.register({ update:(value)=> { spy = value; } }, 'error');
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ])
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this-label';
        form.querySelector('#new-event-start').value = '1980-05-25 8:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        expect(spy).to.deep.equal({ message:'Invalid date. Expected format is yyyy-mm-dd' });
    });

    it('alerts on invalid end datetime', ()=> {
        let spy;
        window.events.register({ update:(value)=> { spy = value; } }, 'error');
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ])
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this-label';
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 1:00';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        expect(spy).to.deep.equal({ message:'Invalid date. Expected format is yyyy-mm-dd' });
    });
})