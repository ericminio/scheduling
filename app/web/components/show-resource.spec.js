const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'show-resource.js')).toString()
    ;

describe('Show resource', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-resource></show-resource>
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

    it('displays resource when notified', ()=>{
        window.events.notify('show resource', {});
        form = document.querySelector('#show-resource-form');

        expect(form.classList.toString()).to.equal('vertical-form');
    });

    it('displays resource type', ()=>{
        window.events.notify('show resource', { type:'bicycle' });

        expect(document.querySelector('#resource-info-type').value).to.equal('bicycle');
    });

    it('displays resource name', ()=>{
        window.events.notify('show resource', { name:'window table' });

        expect(document.querySelector('#resource-info-name').value).to.equal('window table');
    });
})