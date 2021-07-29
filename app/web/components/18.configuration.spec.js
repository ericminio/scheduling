const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'page-configuration.js')).toString()
    ;

describe('Page Configuration', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <page-configuration></page-configuration>
                <script>
                    ${yop}
                    var api = {
                        configuration: ()=> new Promise((resolve)=>{ resolve({ title:'welcome', 'opening-hours':'11-22' }); })  
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
        expect(document.querySelector('#save-configuration')).not.to.equal(null);
    });

    it('displays current title', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('#configuration-title').value).to.equal('welcome');
            done();
        }, 50);        
    });

    it('displays current opening hours', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('#configuration-opening-hours').value).to.equal('11-22');
            done();
        }, 50);        
    });

    it('sends the expected save request', ()=>{
        let spy;
        window.api = { saveConfiguration:(configuration)=> { spy = configuration; return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#configuration-title').value = 'new-title';
        document.querySelector('#configuration-opening-hours').value = '12-18';
        document.querySelector('#save-configuration').click();

        expect(spy).to.deep.equal(
            { title:'new-title', 'opening-hours':'12-18' });
    });

    it('stores the configuration on success', (done)=>{
        window.api = { saveConfiguration:(configuration)=> { return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#configuration-title').value = 'new-title';
        document.querySelector('#configuration-opening-hours').value = '12-18';
        document.querySelector('#save-configuration').click();
        setTimeout(()=> {
            expect(window.store.getObject('configuration')).to.deep.equal(
                { title:'new-title' , 'opening-hours':'12-18' });
            done();
        }, 50);
    });
    
    it('notifies on success', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'configuration updated');
        window.api = { saveConfiguration:(configuration)=> { return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#configuration-title').value = 'new-title';
        document.querySelector('#save-configuration').click();
        setTimeout(()=> {
            expect(wasCalled).to.equal(true);
            done();
        }, 50);
    });

    describe('when configuration load fails', ()=>{
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <page-configuration></page-configuration>
                    <script>
                        ${yop}
                        var api = {
                            configuration: ()=> new Promise((resolve)=>{ resolve(); }),
                            saveConfiguration: ()=> new Promise((resolve)=>{ resolve(); })                             
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
        });

        it('may be because we are signed out', (done)=> {
            let wasCalled = false;
            let spy = {
                update: ()=> { wasCalled = true; }
            };
            window.events.register(spy, 'maybe signed-out');
            window.api.configuration = ()=> {
                return new Promise((resolve, reject)=>{
                    reject();
                });
            };
            document.querySelector('page-configuration').update();
            setTimeout(()=>{
                expect(wasCalled).to.equal(true);
                done();
            }, 150);
        })
    })
})