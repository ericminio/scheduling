const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const { yop } = require('../assets');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'error-message.js')).toString()
    ;

describe('Error message', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-error-message></yop-error-message>
                <script>
                    ${yop}
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;        
    });

    it('is available', ()=>{
        expect(document.querySelector('yop-error-message')).not.to.equal(null);
    });

    it('starts hidden', ()=>{
        expect(document.querySelector('#error-message').classList.toString()).to.equal('hidden');
    });

    it('becomes visible on error', ()=>{
        window.eventBus.notify('error', {})
        expect(document.querySelector('#error-message').classList.toString()).to.equal('');
    });

    it('displays provided message', ()=>{
        window.eventBus.notify('error', { message: 'oops' });
        expect(document.querySelector('#error-message').innerHTML).to.equal('oops');
    });

    it('will close on click', ()=>{
        window.eventBus.notify('error', { message: 'oops' });
        document.querySelector('#error-message').click();
        expect(document.querySelector('#error-message').classList.toString()).to.equal('hidden');
    });

    it('will close on expected notification', ()=>{
        window.eventBus.notify('error', { message: 'oops' });
        window.eventBus.notify('acknowledge error');
        expect(document.querySelector('#error-message').classList.toString()).to.equal('hidden');
    });
})