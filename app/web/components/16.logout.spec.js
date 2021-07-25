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

    it('usually starts hidden', ()=>{
        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block hidden');
    });

    it('becomes visible when connected', ()=>{
        window.store.saveObject('user', { username:'Alex' });
        window.events.notify('connected');
        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block');
    });

    it('navigates to /', ()=>{
        window.store.saveObject('user', { username:'Alex' });
        window.events.notify('connected');
        document.querySelector('#logout-link').click();
        expect(window.location.pathname).to.equal('/');
    });

    it('becomes hidden', ()=>{
        window.store.saveObject('user', { username:'Alex' });
        window.events.notify('connected');
        document.querySelector('#logout-link').click();
        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block hidden');
    });

    it('hidden when disconnected', ()=>{
        window.store.delete('user');
        window.events.notify('maybe signed-out');

        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block hidden');
    });

    it('navigates when disconnected', ()=>{
        window.store.delete('user');
        window.events.notify('maybe signed-out');

        expect(window.location.pathname).to.equal('/');
    });

    it('visible when connected again', ()=>{
        window.store.delete('user');
        window.events.notify('maybe signed-out');
        window.store.saveObject('user', { username:'Alex' });
        window.events.notify('connected');

        expect(document.querySelector('#logout').classList.toString()).to.equal('logout inline-block');
    });

    it('display greetings', ()=>{
        window.store.saveObject('user', { username:'Alex' });
        window.events.notify('connected');
        expect(document.querySelector('#logout-greetings').innerHTML).to.equal('Welcome, Alex');
    });
})