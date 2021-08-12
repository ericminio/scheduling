const { JSDOM } = require("jsdom");
const { expect } = require('chai');
const { yop, domain, data } = require('../assets');
const { Event } = require('../../domain');

describe('Events reader', ()=>{

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
        window.api.getEvents = async (date)=> { wasCalled = true; return new Promise((resolve)=> { resolve({ events:[] }) }); }
        await window.data.getEvents();
        expect(wasCalled).to.equal(true);
    });

    it('returns value from api', async ()=>{
        window.api.getEvents = async (date)=> { return new Promise((resolve)=> { resolve({ events:[ new Event({ label:'one' }), new Event({ label:'two' }) ] }) }); }
        let data = await window.data.getEvents();
        expect(data.events.length).to.equal(2);
        expect(data.events[1].getLabel()).to.equal('two');
    });

})