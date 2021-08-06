const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, '../../domain/configuration.js')).toString()
    + fs.readFileSync(path.join(__dirname, '../data/data-reader.js')).toString()
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
    let wait = 30;

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
        }, wait);        
    });

    it('displays current opening hours', (done)=>{
        setTimeout(()=> {
            expect(document.querySelector('#configuration-opening-hours').value).to.equal('11-22');
            done();
        }, wait);        
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
            let stored = window.store.getObject('configuration');
            expect(stored.title).to.equal('new-title');
            expect(stored['opening-hours']).to.equal('12-18');
            done();
        }, wait);
    });
    
    it('notifies on success', (done)=>{
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.events.register(spy, 'configuration updated');
        window.api = { saveConfiguration:()=> { return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#configuration-title').value = 'new-title';
        document.querySelector('#save-configuration').click();
        setTimeout(()=> {
            expect(wasCalled).to.equal(true);
            done();
        }, wait);
    });
    
    it('request success message display', (done)=>{
        let wasCalled = false;
        let spy = {
            update: (value)=> { wasCalled = value; }
        };
        window.events.register(spy, 'success');
        window.api = { saveConfiguration:()=> { return new Promise((resolve)=> { resolve(); })} };
        document.querySelector('#configuration-title').value = 'new-title';
        document.querySelector('#save-configuration').click();
        setTimeout(()=> {
            expect(wasCalled).to.deep.equal({ message:'Configuration saved' });
            done();
        }, wait);
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
            }, wait);
        })
    })
})