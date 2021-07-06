const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'timeline-marker.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar.js')).toString()
    ;

describe('Calendar', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-container>
                <script>${sut}</script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;

    beforeEach(()=>{
        window = (new JSDOM(html, { runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar');
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    })
    it('adds expected events', ()=>{
        calendar.display([
            { id:'42', start:'15:00', end:'19:30' },
            { id:'15', start:'19:30', end:'23:30' }
        ])
        
        expect(document.querySelector('yop-calendar > events > #event-42')).not.to.equal(null);
        expect(document.querySelector('yop-calendar > events > #event-15')).not.to.equal(null);
    })
})