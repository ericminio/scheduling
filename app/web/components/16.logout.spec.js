const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'logout.js')).toString()
    ;

describe('Logout', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-logout></yop-logout>
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
        window = (new JSDOM(html, { url:'http://localhost/anywhere', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;        
    });

    it('is available', ()=>{
        expect(document.querySelector('yop-logout')).not.to.equal(null);
    });

    it('navigates to /', ()=>{
        document.querySelector('#logout').click();
        expect(window.location.pathname).to.equal('/');
    });

    it('becomes hidden', ()=>{
        document.querySelector('#logout').click();
        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block hidden');
    });

    it('hidden when disconnected', ()=>{
        window.store.delete('user');
        window.events.notify('maybe signed-out');

        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block hidden');
        expect(window.location.pathname).to.equal('/');
    });

    it('visible when connected again', ()=>{
        window.store.delete('user');
        window.events.notify('maybe signed-out');
        window.store.saveObject('user', { any:42 });
        window.events.notify('connected');

        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block');
    });
})