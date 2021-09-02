const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");

describe('Resource creation', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <resource-creation-trigger></resource-creation-trigger>
                <resource-creation-form></resource-creation-form>
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
    let trigger;
    let form;
    let sut;
    let wait = 10;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        trigger = document.querySelector('#resource-creation-trigger');
        form = document.querySelector('#resource-creation-form');
        sut = document.querySelector('resource-creation-form')
        sut.createResource.please = ()=> new Promise((resolve)=>{ resolve(); })
    });

    it('starts hidden', ()=>{
        expect(form.classList.toString()).to.equal('vertical-form hidden');
    });

    it('becomes visible when trigger clicked', ()=>{
        trigger.click();
        expect(form.classList.toString()).to.equal('vertical-form');
    });

    it('sends expected payload', ()=> {
        trigger.click();
        let spy = {};
        sut.createResource.please = (payload)=> { spy = payload; return new Promise((resolve)=> { resolve(); }) } 
        form.querySelector('#resource-type').value = 'this type';
        form.querySelector('#resource-name').value = 'this name';
        form.querySelector('#create-resource').click();

        expect(spy).to.deep.equal({
            type: 'this type',
            name: 'this name',
        });
    });

    it('notifies on resource created', (done)=>{
        trigger.click();
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'resource created');
        form.querySelector('#resource-type').value = 'this type';
        form.querySelector('#resource-name').value = 'this name';
        form.querySelector('#create-resource').click();
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, wait);        
    });

    it('notifies on resource creation success', (done)=>{
        trigger.click();
        let notification = {};
        let spy = {
            update: (value)=> { notification = value; }
        };
        window.events.register(spy, 'success');

        form.querySelector('#resource-type').value = 'this type';
        form.querySelector('#resource-name').value = 'this name';
        form.querySelector('#create-resource').click();
        setTimeout(()=>{
            expect(notification).to.deep.equal({ message:'Resource created' });
            done();
        }, wait);
    });

    it('notifies on resource creation failure', (done)=>{
        sut.createResource.please = ()=> new Promise((resolve, reject)=>{ reject({ message:'creation failed' }); })
        trigger.click();
        let notification = {};
        let spy = {
            update: (value)=> { notification = value; }
        };
        window.events.register(spy, 'error');

        form.querySelector('#resource-type').value = 'this type';
        form.querySelector('#resource-name').value = 'this name';
        form.querySelector('#create-resource').click();
        setTimeout(()=>{
            expect(notification).to.deep.equal({ message:'creation failed' });
            done();
        }, wait);
    });
})