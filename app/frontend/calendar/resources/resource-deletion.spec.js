const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");

describe('Resource deletion', ()=>{

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
    let sut;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;  
        sut = document.querySelector('show-resource');   
        sut.deleteResource.please = ()=> new Promise((resolve)=> { resolve(); })
    })

    it('is available from show resource box', ()=>{
        window.eventBus.notify('show resource', {});
        
        expect(document.querySelector('#delete-resource')).not.to.equal(null);
    });

    it('sends the expected request', ()=>{
        let spy;
        sut.deleteResource.please = (resource)=> { spy = resource; return new Promise((resolve)=> { resolve(); }) }
        window.eventBus.notify('show resource', { id:'this-resource' });
        document.querySelector('#delete-resource').click();

        expect(spy).to.deep.equal({ id:'this-resource' });
    });

    it('notifies on resource deleted', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.eventBus.register(spy, 'resource deleted');
        window.eventBus.notify('show resource', { id:'this-resource' });
        document.querySelector('#delete-resource').click();
        
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    it('closes resource info box', (done)=>{
        window.eventBus.notify('show resource', { id:'this-resource' });
        document.querySelector('#delete-resource').click();

        setTimeout(()=>{
            form = document.querySelector('#show-resource-form');
            expect(form.classList.toString()).to.equal('vertical-form hidden');
            done();
        }, 50);
    });
})