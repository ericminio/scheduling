const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const { Resource, Event } = require("../../domain");
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    ;

describe('Calendar Event click', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar-event></yop-calendar-event>
                <script>
                    ${yop}
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendarEvent;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendarEvent = document.querySelector('yop-calendar-event');
    });

    it('is ready to be inspected', ()=>{
        expect(calendarEvent).not.to.equal(null);
    });

    it('notifies on click', (done)=>{
        let actual = {};
        let spy = {
            update: (value)=> { actual = value; }
        };
        window.events.register(spy, 'show event');
        calendarEvent.digest(
            new Event({ id:'event-id', label:'event-label', start:'18:00', end:'20:30', resources:[{ id:'resource-id' }] }), 
            new Resource({ id:'resource-id' })
        );
        calendarEvent.click();
        
        setTimeout(()=>{
            expect(actual).to.deep.equal({ id:'event-id', label:'event-label', start:'18:00', end:'20:30', resources:[{ id:'resource-id' }] });
            done();
        }, 50);
    });
})