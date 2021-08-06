const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const { Configuration } = require("../../domain");
const sut = ''
    + fs.readFileSync(path.join(__dirname, '../../domain/configuration.js')).toString()
    + fs.readFileSync(path.join(__dirname, '../data/data-reader.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'header.js')).toString()
    ;

describe('Header', ()=>{

    let wait = 10;
    describe('When configuration is already available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        store.saveObject('configuration', 
                            { title:'Resto', 'opening-hours':'12-15' });
                        var api = {};
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

        it('uses the available title', (done)=>{
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Resto');
                done();
            }, wait);            
        });

        it('uses opening hours', (done)=>{
            setTimeout(()=> {
                let root = document.documentElement;
                let start = root.style.cssText;
                expect(start).to.equal('--opening-hours-start: 12; --opening-hours-end: 15;');
                done();
            }, wait); 
        });
    });

    describe('When configuration is not already available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        var api = {                            
                            configuration: ()=> new Promise((resolve)=>{ resolve({
                                title: 'Agenda', 'opening-hours':'8-15'
                            }); })  
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

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Agenda');
                done();
            }, wait);
        });

        it('stores it', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(new Configuration(
                    { title:'Agenda', 'opening-hours':'8-15' } ));
                done();
            }, wait);
        });
    });

    describe('When configuration is not completely available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        store.saveObject('configuration', 
                            { title:'Resto' });
                        var api = {                            
                            configuration: ()=> new Promise((resolve)=>{ resolve({
                                title: 'Agenda', 'opening-hours':'8-15'
                            }); })  
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

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Agenda');
                done();
            }, wait);
        });

        it('stores it', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(new Configuration({ title:'Agenda', 'opening-hours':'8-15' }));
                done();
            }, wait);
        });
    });

    describe('When configuration is manually modified', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        var api = {};
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

        it('lets that happen', (done)=>{            
            window.store.saveObject('configuration', { title:'Home', 'opening-hours':'11-13' });
            let header = document.querySelector('yop-header');
            header.update();
            
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Home');
                done();
            }, wait);            
        });
    });

    describe('when configuration is updated', ()=>{
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-header></yop-header>
                    <script>
                        ${yop}
                        store.saveObject('configuration', { title:'Resto' });
                        var api = {};
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

        it('uses the new title', (done)=>{
            window.store.saveObject('configuration', { title:'Agenda', 'opening-hours':'8-18' });
            window.events.notify('configuration updated')
            setTimeout(()=> {
                expect(document.querySelector('yop-header #title').innerHTML).to.equal('Agenda');
                done();
            }, wait);            
        });

        it('uses new opening hours', (done)=>{
            window.store.saveObject('configuration', { title:'Agenda', 'opening-hours':'8-18' });
            window.events.notify('configuration updated');
            setTimeout(()=> {
                let root = document.documentElement;
                let start = root.style.cssText;
                expect(start).to.equal('--opening-hours-start: 8; --opening-hours-end: 18;');
                done();
            }, wait);
        });
    });
})