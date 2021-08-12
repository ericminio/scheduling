const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'system-status.js')).toString()
    ;

describe('System status', ()=>{
    
    let window;
    let document;
    let status;
    let wait = 10;

    describe('when all is good', ()=>{
        
        beforeEach((done)=>{
            let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <system-status></system-status>
                    <script>
                        let api = {
                            ping: ()=> {
                                return new Promise((resolve, reject)=>{
                                    resolve({ alive:true });
                                });
                            }                        
                        };
                        ${sut}
                    </script>
                </body>
            </html>
            `;
            window = (new JSDOM(html, { runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            status = document.querySelector('system-status');
            setTimeout(done, wait);
        });
    
        it('is green', ()=>{
            expect(status.querySelector(".status-green")).not.to.equal(null);
        });
    });
    describe('when server is down', ()=>{
        
        beforeEach((done)=>{
            let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <system-status></system-status>
                    <script>
                        let api = {
                            ping: ()=> {
                                return new Promise((resolve, reject)=>{
                                    reject();
                                });
                            }                        
                        };
                        ${sut}
                    </script>
                </body>
            </html>
            `;
            window = (new JSDOM(html, { runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            status = document.querySelector('system-status');
            setTimeout(done, wait);
        });
    
        it('is is red', ()=>{
            expect(status.querySelector(".status-red")).not.to.equal(null);
        });
    });

    describe('refresh', ()=>{
        
        beforeEach((done)=>{
            let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <system-status refresh="30"></system-status>
                    <script>
                        var api = {
                            ping: ()=> {
                                return new Promise((resolve, reject)=>{
                                    resolve({ alive:true });
                                });
                            }                        
                        };
                        ${sut}
                    </script>
                </body>
            </html>
            `;
            window = (new JSDOM(html, { runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            status = document.querySelector('system-status');
            setTimeout(done, wait);
        });
    
        it('can be configured', (done)=>{
            let count = 0;
            window.api.ping = ()=> {                
                return new Promise((resolve, reject)=>{                    
                    count ++;
                    resolve();
                });
            };
            setTimeout(()=>{
                expect(count).to.equal(2);
                expect(status.querySelector(".status-green")).not.to.equal(null);
                done();
            }, 2*30 + 10);
        });
    });
});