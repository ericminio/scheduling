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

describe('When access to calendar is forbidden', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-container>
                <script>
                    ${yop}
                    store.saveObject('resources', { any:42 });
                    var api = {
                        getResources: ()=> {
                            return new Promise((resolve, reject)=>{
                                reject({ message:'forbidden' });
                            });
                        },
                        getEvents: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[
                                    { id:'42', start:'2015-09-21 15:00', end:'2015-09-21 19:30', resources:[{id:'1'}] },
                                    { id:'15', start:'2015-09-21 19:30', end:'2015-09-21 23:30', resources:[{id:'2'}, {id:'3'}] }
                                ]});
                            });
                        }                        
                    };
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost/events', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar');
        setTimeout(done, 150);
    });

    it('deletes locally stored resources', ()=>{
        expect(window.store.getObject('resources')).to.equal(null);
    });

    it('navigates to /', ()=> {
        expect(window.location.pathname).to.equal('/');
    })
})