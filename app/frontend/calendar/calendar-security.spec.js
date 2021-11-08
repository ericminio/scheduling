const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const { JSDOM } = require("jsdom");

describe('When resource load fails', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <div id="page"></div>
                <script>
                    ${yop}
                    ${domain}
                    ${data}
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;
    let page;
    let wait = 1;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost/calendar-day', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.createElement('yop-calendar-day');
        page = document.querySelector('#page');
        calendar.getResources.please = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ resources:[] });
            });
        };
        calendar.searchEvents.inRange = ()=> {
            return new Promise((resolve, reject)=>{
                resolve({ events:[]});
            });
        };
    });

    let showCalendar = ()=> {
        page.appendChild(calendar);
    }

    it('deletes locally stored resources', (done)=>{
        showCalendar();
        calendar.getResources.please = ()=> {
            return new Promise((resolve, reject)=>{
                reject();
            });
        };
        window.eventBus.notify('resource created');
        setTimeout(()=>{
            expect(window.store.getObject('resources')).to.equal(null);
            done();
        }, wait);
    });

    it('may be because we are signed out', (done)=> {
        showCalendar();
        let wasCalled = false;
        let spy = {
            update: ()=> { wasCalled = true; }
        };
        window.eventBus.register(spy, 'maybe signed-out');
        calendar.getResources.please = ()=> {
            return new Promise((resolve, reject)=>{
                reject();
            });
        };
        window.eventBus.notify('resource created');
        setTimeout(()=>{
            expect(wasCalled).to.equal(true);
            done();
        }, wait);
    })
})