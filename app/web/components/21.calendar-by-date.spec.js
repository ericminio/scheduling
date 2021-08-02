const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'resource.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'timeline-marker.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar.js')).toString()
    ;

describe('Calendar by day', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-calendar>
                <script>
                    ${yop}
                    today = ()=> { return new Date(2015, 6, 1); }

                    var api = {
                        getResources: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ resources:[
                                    { id:'1', type:'plane', name:'GSDZ' },
                                    { id:'2', type:'plane', name:'GKMY' },
                                    { id:'3', type:'instructor', name:'Vasile' }
                                ]});
                            });
                        },
                        getEvents: (date)=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[
                                    { id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] },
                                    { id:'15', start:'2015-09-21 19:30', end:'2015-09-21 23:30', resources:[{id:'2'}, {id:'3'}] }
                                ]});
                            });
                        }                        
                    };
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'0-24' });
                    ${sut}
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
        calendar = document.querySelector('yop-calendar');
        setTimeout(done, wait);
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    });
    it('is initializes calendar date field with today', ()=>{
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
                    { id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] }
                ]});
            });
        };
        document.querySelector('#calendar-search').click();

        expect(spy).to.equal('2015-09-21');
    });
})