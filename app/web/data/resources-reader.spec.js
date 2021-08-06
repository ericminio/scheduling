const { JSDOM } = require("jsdom");
const { expect } = require('chai');
const { yop, domain, data } = require('../assets');
const { Resource } = require('../../domain');

describe('Resources reader', ()=>{

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
        window.api.getResources = async ()=> { wasCalled = true; return new Promise((resolve)=> { resolve({ resources:[] }) }); }
        await window.data.getResources();
        expect(wasCalled).to.equal(true);
    });

    it('returns value from api', async ()=>{
        window.api.getResources = async ()=> { return new Promise((resolve)=> { resolve({ resources:[ new Resource({ name:'one' }), new Resource({ name:'two' }) ] }) }); }
        let data = await window.data.getResources();
        expect(data.resources.length).to.equal(2);
        expect(data.resources[1].getName()).to.equal('two');
    });

})