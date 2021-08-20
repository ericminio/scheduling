const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const { JSDOM } = require("jsdom");
const { Event } = require('../../domain');

describe('Show event', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-event></show-event>
                <script>
                    ${yop}
                    ${components}
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
    })

    it('displays event when notified', ()=>{
        window.events.notify('show event', new Event({}));
        form = document.querySelector('#show-event-form');

        expect(form.classList.toString()).to.equal('vertical-form');
    });

    it('displays event label', ()=>{
        window.events.notify('show event', new Event({ label:'Alex' }));

        expect(document.querySelector('#event-info-label').value).to.equal('Alex');
    });

    it('displays event start', ()=>{
        window.events.notify('show event', new Event({ start:'2021-09-21 19:30' }));

        expect(document.querySelector('#event-info-start').value).to.equal('2021-09-21 19:30');
    });

    it('displays event end', ()=>{
        window.events.notify('show event', new Event({ end:'2021-09-21 23:30' }));

        expect(document.querySelector('#event-info-end').value).to.equal('2021-09-21 23:30');
    });

    it('displays event notes', ()=>{
        window.events.notify('show event', new Event({ notes:'birthday' }));

        expect(document.querySelector('#event-info-notes').value).to.equal('birthday');
    });

    it('resists empty event label', ()=>{
        window.events.notify('show event', new Event({ notes:'without label' }));

        expect(document.querySelector('#event-info-label').value).to.equal('');
    });
    it('resists empty event notes', ()=>{
        window.events.notify('show event', new Event({ label:'without notes' }));

        expect(document.querySelector('#event-info-notes').value).to.equal('');
    });
})