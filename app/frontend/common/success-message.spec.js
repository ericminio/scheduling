const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const { yop } = require('../assets');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'success-message.js')).toString()
    ;

describe('Success message', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-success-message></yop-success-message>
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
        expect(document.querySelector('yop-success-message')).not.to.equal(null);
    });

    it('starts hidden', ()=>{
        expect(document.querySelector('#success-message').classList.toString()).to.equal('hidden');
    });

    it('becomes visible on success', ()=>{
        window.eventBus.notify('success', {})
        expect(document.querySelector('#success-message').classList.toString()).to.equal('');
    });

    it('displays provided message', ()=>{
        window.eventBus.notify('success', { message: 'nice!' });
        expect(document.querySelector('#success-message').innerHTML).to.equal('nice!');
    });

    it('will close on click', ()=>{
        window.eventBus.notify('success', { message: 'nice!' });
        document.querySelector('#success-message').click();
        expect(document.querySelector('#success-message').classList.toString()).to.equal('hidden');
    });

    it('cleans eventBus on disconnection', ()=> {
        document.querySelector('yop-success-message').remove();

        expect(window.eventBus.isEmpty()).to.equal(true);
    });
})