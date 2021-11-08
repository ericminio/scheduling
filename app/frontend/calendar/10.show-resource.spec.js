const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const { JSDOM } = require("jsdom");

describe('Show resource', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-resource></show-resource>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
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

    it('displays resource when notified', ()=>{
        window.eventBus.notify('show resource', {});
        form = document.querySelector('#show-resource-form');

        expect(form.classList.toString()).to.equal('vertical-form');
    });

    it('displays resource type', ()=>{
        window.eventBus.notify('show resource', { type:'bicycle' });

        expect(document.querySelector('#resource-info-type').value).to.equal('bicycle');
    });

    it('displays resource name', ()=>{
        window.eventBus.notify('show resource', { name:'window table' });

        expect(document.querySelector('#resource-info-name').value).to.equal('window table');
    });
})