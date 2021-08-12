const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'resource-creation.js')).toString()
    ;

describe('Resource creation', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <resource-creation></resource-creation>
                <script>
                    ${yop}
                    var api = {
                        createResource: ()=> {
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
        form = document.querySelector('#resource-creation-form');
    })

    it('is ready', ()=>{
        expect(form).not.to.equal(null);
    });

    it('sends expected payload', ()=> {
        let spy = {};
        window.api = { createResource:(payload)=> { spy = payload; return new Promise((resolve)=> { resolve(); })} }
        window.events.notify('resource creation');
        form.querySelector('#resource-type').value = 'this type';
        form.querySelector('#resource-name').value = 'this name';
        form.querySelector('#create-resource').click();

        expect(spy).to.deep.equal({
            type: 'this type',
            name: 'this name',
        });
    });

    it('notifies on resource created', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'resource created');
        form.querySelector('#create-resource').click();
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('does not send extra creation', ()=> {
        let spy = 0;
        window.api = { createResource:(payload)=> { spy ++; return new Promise((resolve)=> { resolve(); })} }
        window.events.notify('resource creation');
        form.querySelector('#resource-type').value = 'this type';
        form.querySelector('#resource-name').value = 'this name';
        window.events.notify('resource creation');
        window.events.notify('resource creation');
        form.querySelector('#create-resource').click();

        expect(spy).to.equal(1);
    });
})