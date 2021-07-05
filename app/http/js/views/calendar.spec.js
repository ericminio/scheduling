const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
let fs = require('fs');
let path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar.js')).toString();

describe('Calendar', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <style>
                    :root {
                        --minimalWidthInMinutes: 10px;
                    }
                </style>
            </head>
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
        
        expect(document.querySelector('events > #event-42')).not.to.equal(null);
        expect(document.querySelector('events > #event-15')).not.to.equal(null);
    })
    it('sizes event as expected', ()=>{
        calendar.display([{ id:'42', start:'15:00', end:'19:00' }])
        let element = document.querySelector('#event-42');

        expect(element.dataset.width).to.equal('calc((4 * 2 + 0) * var(--minimalWidthInMinutes))')
    })
    it('positions event as expected', ()=>{
        calendar.display([{ id:'42', start:'15:00', end:'19:00' }])
        let element = document.querySelector('#event-42');

        expect(element.dataset.left).to.equal('calc((15 * 2 + 0) * var(--minimalWidthInMinutes) + var(--padding))')
    })
})