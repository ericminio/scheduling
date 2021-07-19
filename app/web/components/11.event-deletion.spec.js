const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'show-event.js')).toString()
    ;

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
                    ${sut}
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
        window.events.notify('show event', {id:'42'});

        expect(document.querySelector('#delete-event')).not.to.equal(null);
    });

    it('sends the expected request', ()=>{
        let spy;
        window.api = { deleteEvent:(event)=> { spy = event; return new Promise((resolve)=> { resolve(); })} }
        window.events.notify('show event', {id:'42'});
        document.querySelector('#delete-event').click();

        expect(spy).to.deep.equal({ id:'42' });
    });

    it('notifies on event deleted', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'event deleted');
        window.events.notify('show event', {id:'42'});
        document.querySelector('#delete-event').click();
        
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('closes event info box', (done)=>{
        window.events.notify('show event', {id:'42'});
        document.querySelector('#delete-event').click();

        setTimeout(()=>{
            form = document.querySelector('#show-event-form');
            expect(form.classList.toString()).to.equal('vertical-form hidden');
            done();
        }, 50);
    });
})