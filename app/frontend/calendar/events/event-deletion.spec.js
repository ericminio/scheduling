const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");
const { Event } = require('../../../domain');

describe('Event deletion', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-event></show-event>
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

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;    
        sut = document.querySelector('show-event');
        sut.deleteEvent.please = (id)=> new Promise((resolve, reject)=> { resolve(); })
    })

    it('is available from event info box', ()=>{
        window.events.notify('show event', new Event({id:'42'}));

        expect(document.querySelector('#delete-event')).not.to.equal(null);
    });

    it('sends the expected request', ()=>{
        let spy;
        sut.deleteEvent.please = (id)=> { spy = id; return new Promise((resolve, reject)=> { resolve(); }) }
        window.events.notify('show event', new Event({id:42}));
        document.querySelector('#delete-event').click();

        expect(spy).to.equal(42);
    });

    it('notifies on event deleted', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'event deleted');
        window.events.notify('show event', new Event({id:'42'}));
        document.querySelector('#delete-event').click();
        
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('closes event info box', (done)=>{
        window.events.notify('show event', new Event({id:'42'}));
        document.querySelector('#delete-event').click();

        setTimeout(()=>{
            form = document.querySelector('#show-event-form');
            expect(form.classList.toString()).to.equal('vertical-form hidden');
            done();
        }, 50);
    });

    it('does not send extra deletion', ()=>{
        let spy = 0;
        sut.deleteEvent.please = (id)=> { spy ++; return new Promise((resolve, reject)=> { resolve(); }) }
        window.events.notify('show event', new Event({id:'42'}));
        window.events.notify('show event', new Event({id:'42'}));
        window.events.notify('show event', new Event({id:'42'}));
        document.querySelector('#delete-event').click();

        expect(spy).to.equal(1);
    });
})