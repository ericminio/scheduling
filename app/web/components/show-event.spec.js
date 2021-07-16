const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'show-event.js')).toString()
    ;

describe('Show event', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-event></show-event>
                <script>
                    ${yop}
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
    })

    it('displays event when notified', ()=>{
        window.events.notify('show event', {});
        form = document.querySelector('#show-event-form');

        expect(form.classList.toString()).to.equal('vertical-form');
    });

    it('displays event label', ()=>{
        window.events.notify('show event', { label:'Alex' });

        expect(document.querySelector('#event-info-label').value).to.equal('Alex');
    });

    it('displays event start', ()=>{
        window.events.notify('show event', { start:'2021-09-21 19:30' });

        expect(document.querySelector('#event-info-start').value).to.equal('2021-09-21 19:30');
    });

    it('displays event end', ()=>{
        window.events.notify('show event', { end:'2021-09-21 23:30' });

        expect(document.querySelector('#event-info-end').value).to.equal('2021-09-21 23:30');
    });
})