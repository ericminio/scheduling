const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'show-resource.js')).toString()
    ;

describe('Resource deletion', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <show-resource></show-resource>
                <script>
                    ${yop}
                    var api = {
                        deleteResource: (resource)=> new Promise((resolve)=>{ resolve(); })  
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
    })

    it('is available from show resource box', ()=>{
        window.events.notify('show resource', {});
        
        expect(document.querySelector('#delete-resource')).not.to.equal(null);
    });

    it('sends the expected request', ()=>{
        let spy;
        window.api = { deleteResource:(resource)=> { spy = resource; return new Promise((resolve)=> { resolve(); })} }
        window.events.notify('show resource', { id:'this-resource' });
        document.querySelector('#delete-resource').click();

        expect(spy).to.deep.equal({ id:'this-resource' });
    });

    it('notifies on resource deleted', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'resource deleted');
        window.events.notify('show resource', { id:'this-resource' });
        document.querySelector('#delete-resource').click();
        
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('closes resource info box', (done)=>{
        window.events.notify('show resource', { id:'this-resource' });
        document.querySelector('#delete-resource').click();

        setTimeout(()=>{
            form = document.querySelector('#show-resource-form');
            expect(form.classList.toString()).to.equal('vertical-form hidden');
            done();
        }, 50);
    });
})