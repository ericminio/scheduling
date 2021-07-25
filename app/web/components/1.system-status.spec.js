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
            setTimeout(done, 150);
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
            setTimeout(done, 150);
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
                    <system-status refresh="50"></system-status>
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
            setTimeout(done, 150);
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
                expect(count).to.equal(3);
                expect(status.querySelector(".status-green")).not.to.equal(null);
                done();
            }, 150);
        });
    });
});