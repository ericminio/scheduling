const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'event-creation.js')).toString()
    ;

describe('Event creation', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <event-creation></event-creation>
                <script>
                    ${yop}
                    var api = {
                        createEvent: (payload)=> {
                            return new Promise((resolve, reject)=>{
                                resolve();
                            });
                        }                        
                    };
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let form;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        form = document.querySelector('#event-creation-form');
    })

    it('is ready', ()=>{
        expect(form).not.to.equal(null);
    });

    it('sends expected payload', ()=> {
        let spy = {};
        window.api = { createEvent:(payload)=> { spy = payload; } }
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
    })
})