const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai')
const sut = require('fs').readFileSync(require('path').join(__dirname, 'calendar.js')).toString();

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
    let document;
    let calendar;

    beforeEach(()=>{
        const { window } = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        document = window.document;
        calendar = document.querySelector('yop-calendar');
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    })
    it('adds expected event', ()=>{
        calendar.display([{ id:'42', start:'15:00', end:'19:30' }])
        let element = document.querySelector('events > #event-42.common[data-start="15:00"][data-end="19:30"]');

        expect(element).not.to.equal(null);
    })
})