const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { Event }= require('../../domain')

describe('Move to next day', ()=>{

    let html = `
        <!DOCTYPE html><html lang="en"><body>
            <yop-calendar-day></yop-calendar-day>
            <script>
                ${yop}
                store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                ${domain}
                today = ()=> { return new Date(2015, 8, 20); }
                ${data}                    
                api.getResources = ()=> {
                    return new Promise((resolve, reject)=>{
                        resolve({ resources:[
                            { id:'1', type:'plane', name:'GSDZ' }
                        ]});
                    });
                };
                api.getEvents = (date)=> {
                    return new Promise((resolve, reject)=>{
                        resolve({ events:[]});
                    });
                };
                ${components}
            </script>
        </body></html>`;
    let window;
    let document;
    let nextDay;
    let wait = 10;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        nextDay = document.querySelector('#calendar-next-day');
        setTimeout(done, wait);
    })

    it('is available', ()=>{
        expect(nextDay).not.to.equal(null);
    });
    it('initializes calendar date field with nextDay', ()=>{
        nextDay.click();
        let field = document.querySelector('#calendar-date');
        expect(field.value).to.equal('2015-09-21');
    });
    it('sends the expected request', ()=>{
        let spy;
        window.api.getEvents = (date)=> {
            spy = date;
            return new Promise((resolve, reject)=>{
                resolve({ events:[
                    new Event({ id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] })
                ]});
            });
        };
        nextDay.click();

        expect(spy).to.equal('2015-09-21');
    });
})