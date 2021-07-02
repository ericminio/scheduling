const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai')
const calendar = require('fs').readFileSync(require('path').join(__dirname, 'calendar.js')).toString();

describe('Calendar', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-container>
                <script>${calendar}</script>
            </body>
        </html>
        `
    let document

    beforeEach(()=>{
        const { window } = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        document = window.document;
    })

    it('is available', ()=>{
        let element = document.querySelector('yop-calendar');

        expect(element).not.to.equal(null);
    })
    it('displays expected event', ()=>{
        let element = document.querySelector('#event-E3');

        expect(element).not.to.equal(null);
    })
})