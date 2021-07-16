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
    })
})