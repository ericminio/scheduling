const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");

describe('Event creation', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <event-creation></event-creation>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let sut;
    let form;
    let wait = 10;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        window.store.saveObject('resources', [
            { id:'one', name:'one' },
            { id:'two', name:'two' },
            { id:'three', name:'three' }
        ]);
        sut = document.querySelector('event-creation');
        form = document.querySelector('#event-creation-form');
        sut.eventsRepository.storeEvent = ()=> new Promise((resolve)=>{ resolve(); })
    });

    it('is ready', ()=>{
        expect(form).not.to.equal(null);
    });

    it('becomes available via message', ()=> {
        expect(form.classList.toString()).to.equal('vertical-form hidden');
        window.events.notify('event creation', '2015-07-01');

        expect(form.classList.toString()).to.equal('vertical-form');
    });

    it('prepopulates start', ()=> {
        window.events.notify('event creation', '1980-05-25');

        expect(form.querySelector('#new-event-start').value).to.equal('1980-05-25 08:00');
    });

    it('prepopulates end', ()=> {
        window.events.notify('event creation', '1980-05-25');

        expect(form.querySelector('#new-event-end').value).to.equal('1980-05-25 20:00');
    });

    it('presents available resources present in store', ()=> {
        window.events.notify('event creation', '1980-05-25');

        expect(form.querySelector('#new-event-resource-one').value).to.equal('one');
        expect(form.querySelector('#new-event-resource-two').value).to.equal('two');
        expect(form.querySelector('#new-event-resource-three').value).to.equal('three');
    });

    it('sends expected payload', (done)=> {
        let spy = {};
        sut.eventsRepository.storeEvent = (payload)=> { spy = payload; return new Promise((resolve)=> { resolve(); })};
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this label';
        form.querySelector('#new-event-notes').value = 'these-notes';
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        setTimeout(()=>{
            expect(spy).to.deep.equal({
                id: undefined,
                label: 'this label',
                notes: 'these-notes',
                start: '1980-05-25 08:00',
                end: '1980-05-25 10:00',
                resources: [ { id:'two' }, { id:'three' } ]
            });
            done();
        }, wait);
    });

    it('notifies on event created', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'event created');
        
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this label';
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#create-event').click();
        
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('does not send extra creation', (done)=> {
        let spy = 0;
        sut.eventsRepository.storeEvent = ()=> { spy ++; return new Promise((resolve)=> { resolve(); })};
        window.events.notify('event creation');
        window.events.notify('event creation');
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this label';
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#new-event-resource-two').checked = true;
        form.querySelector('#new-event-resource-three').checked = true;
        form.querySelector('#create-event').click();

        setTimeout(()=> {
            expect(spy).to.equal(1);
            done();
        }, wait)
    });

    it('alerts on event creation failure', (done)=> {
        sut.eventFactory.buildEvent = (paylaod)=> new Promise((resolve, reject)=>{
            reject({ message:'creation failed' });
        });
        let spy;
        window.events.register({ update:(value)=> { spy = value; } }, 'error');
        window.events.notify('event creation');
        form.querySelector('#create-event').click();

        setTimeout(()=>{
            expect(spy).to.deep.equal({ message:'creation failed' });
            done();
        }, wait);
    });

    it('alerts on event save failure', (done)=> {
        sut.eventsRepository.storeEvent = ()=> new Promise((resolve, reject)=>{ reject({ message:'save failed' }); })
        window.events.register({ update:(value)=> { spy = value; } }, 'error');
        window.events.notify('event creation');
        form.querySelector('#new-event-label').value = 'this label';
        form.querySelector('#new-event-start').value = '1980-05-25 08:00';
        form.querySelector('#new-event-end').value = '1980-05-25 10:00';
        form.querySelector('#create-event').click();

        setTimeout(()=>{
            expect(spy).to.deep.equal({ message:'save failed' });
            done();
        }, wait);
    });
})