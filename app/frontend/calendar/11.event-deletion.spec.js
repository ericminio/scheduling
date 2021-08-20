const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const { JSDOM } = require("jsdom");
const { Event } = require('../../domain');

describe('Event deletion', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-event></show-event>
                <script>
                    ${yop}
                    var api = {
                        deleteEvent: (event)=> new Promise((resolve)=>{ resolve(); })  
                    };
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;        
    })

    it('is available from event info box', ()=>{
        window.events.notify('show event', new Event({id:'42'}));

        expect(document.querySelector('#delete-event')).not.to.equal(null);
    });

    it('sends the expected request', ()=>{
        let spy;
        window.api = { deleteEvent:(event)=> { spy = event.id; return new Promise((resolve)=> { resolve(); })} }
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
        window.api = { deleteEvent:(event)=> { spy ++ ; return new Promise((resolve)=> { resolve(); })} }
        window.events.notify('show event', new Event({id:'42'}));
        window.events.notify('show event', new Event({id:'42'}));
        window.events.notify('show event', new Event({id:'42'}));
        document.querySelector('#delete-event').click();

        expect(spy).to.equal(1);
    });
})