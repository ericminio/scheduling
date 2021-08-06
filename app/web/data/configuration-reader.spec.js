const { JSDOM } = require("jsdom");
const { expect } = require('chai');
const { yop, domain, data } = require('../assets');
const { Configuration } = require('../../domain');

describe('Reader Configuration', ()=>{

    describe('when configuration is present in store', ()=>{
        let html = `
            <!DOCTYPE html><html lang="en"><body>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                </script>
            </body></html>`;
        let window;
        let wait = 10;

        beforeEach((done)=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            setTimeout(done, wait);
        });

        it('returns configuration from store', async ()=>{
            let configuration = await window.data.configuration();
            expect(configuration).to.deep.equal(new Configuration({ title:'Resto', 'opening-hours':'0-24' }));
        });
    });

    describe('when configuration is not present in store', ()=>{
        let html = `
            <!DOCTYPE html><html lang="en"><body>
                <script>
                    ${yop}
                    ${domain}
                    ${data}
                </script>
            </body></html>`;
        let window;
        let wait = 10;

        beforeEach((done)=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            setTimeout(done, wait);
        });

        it('goes to api', async ()=>{
            let wasCalled;
            window.api.configuration = async ()=> { wasCalled = true; return new Promise((resolve)=> { resolve({}) }); }
            await window.data.configuration();
            expect(wasCalled).to.equal(true);
        });

        it('returns value from api', async ()=>{
            window.api.configuration = async ()=> { return new Promise((resolve)=> { resolve({ title:'from api', 'opening-hours':'11-12' }) }); }
            let configuration = await window.data.configuration();
            expect(configuration).to.deep.equal(new Configuration({ title:'from api', 'opening-hours':'11-12' }));
        });

        it('stores returned value', async ()=>{
            window.api.configuration = async ()=> { return new Promise((resolve)=> { resolve({ title:'from api', 'opening-hours':'11-12' }) }); }
            await window.data.configuration();
            let configuration = window.store.getObject('configuration')
            expect(configuration).to.deep.equal(new Configuration({ title:'from api', 'opening-hours':'11-12' }));
        });
    });

})