const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'sign-in.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'error-message.js')).toString()
    ;

describe('Sign in', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-error-message></yop-error-message>
                <yop-sign-in></yop-sign-in>
                <script>
                    ${yop}
                    store.saveObject('user', { any:42 });
                    var api = {
                        signIn: (credentials)=> new Promise((resolve)=>{ resolve(); })  
                    };
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
    })

    it('is available', ()=>{
        expect(document.querySelector('#username')).not.to.equal(null);
        expect(document.querySelector('#password')).not.to.equal(null);
        expect(document.querySelector('#signin')).not.to.equal(null);
    });

    it('sends the expected request', ()=>{
        let spy;
        window.api = { signIn:(credentials)=> { spy = credentials; return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#username').value = 'this';
        document.querySelector('#password').value = 'that';
        document.querySelector('#signin').click();

        expect(spy).to.deep.equal(
            { username:'this', password:'that' });
    });

    it('stays on failure', (done)=>{
        window.api = { signIn:()=> { return new Promise((resolve, reject)=> { reject({ message:'failure' }); })} };
        document.querySelector('#signin').click();
        setTimeout(()=>{
            expect(window.location.pathname).to.equal('/');
            done();
        });
    });

    it('displays error message on failure', (done)=>{
        window.api = { signIn:()=> { return new Promise((resolve, reject)=> { reject({ message:'failure' }); })} };
        document.querySelector('#signin').click();
        setTimeout(()=>{
            expect(document.querySelector('#error-message').innerHTML).to.equal('failure');
            done();
        });
    });

    it('navigates on success', (done)=>{
        window.api = { signIn:()=> { return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#signin').click();
        setTimeout(()=>{
            expect(window.location.pathname).to.equal('/events');
            done();
        });
    });

    it('stores key on success', (done)=>{
        window.api = { signIn:()=> { return new Promise((resolve)=> { resolve({ 
            username:'this-username', 
            key:'send-me' 
        }); })} };
        document.querySelector('#username').value = 'this-username';
        document.querySelector('#signin').click();
        setTimeout(()=>{
            expect(window.store.getObject('user')).to.deep.equal({ 
                username:'this-username', 
                key:'send-me' 
            });
            done();
        });
    });

    it('deletes locally stored user', ()=>{
        expect(window.store.getObject('user')).to.equal(null);
    });
})