const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { Event }= require('../../domain')

describe('Calendar by day', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar-day></yop-calendar-day>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
                    today = ()=> { return new Date(2015, 6, 1); }
                    api.getResources = ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve({ resources:[
                                { id:'1', type:'plane', name:'GSDZ' },
                                { id:'2', type:'plane', name:'GKMY' },
                                { id:'3', type:'instructor', name:'Vasile' }
                            ]});
                        });
                    };
                    api.getEvents = (date)=> {
                        return new Promise((resolve, reject)=>{
                            resolve({ events:[
                                new Event({ id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] }),
                                new Event({ id:'15', start:'2015-09-21 19:30', end:'2015-09-21 23:30', resources:[{id:'2'}, {id:'3'}] })
                            ]});
                        });
                    };
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;
    let wait = 10;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar-day');
        setTimeout(done, wait);
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    });
    it('initializes calendar date field with today', ()=>{
        let field = document.querySelector('#calendar-date');
        expect(field.value).to.equal('2015-07-01');
    });
    it('sends the expected request', ()=>{
        let field = document.querySelector('#calendar-date');
        field.value = '2015-09-21';
        let spy;
        window.api.getEvents = (date)=> {
            spy = date;
            return new Promise((resolve, reject)=>{
                resolve({ events:[
                    new Event({ id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] })
                ]});
            });
        };
        document.querySelector('#calendar-search').click();

        expect(spy).to.equal('2015-09-21');
    });
    it('alerts on invalid date', ()=>{
        let field = document.querySelector('#calendar-date');
        field.value = '2015-9-21';
        let spy;
        window.events.register({ update:(value)=> { spy = value; } }, 'error');
        document.querySelector('#calendar-search').click();

        expect(spy).to.deep.equal({ message:'Invalid date. Expected format is yyyy-mm-dd' });
    });
})