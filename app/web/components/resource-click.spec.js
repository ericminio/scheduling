const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'resource.js')).toString()
    ;

describe('Resource click', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar-resource></yop-calendar-resource>
                <script>
                    ${yop}
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendarResource;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendarResource = document.querySelector('yop-calendar-resource');
    });

    it('is ready to be inspected', ()=>{
        expect(calendarResource).not.to.equal(null);
    });

    it('notifies on click', (done)=>{
        let actual = {};
        let spy = {
            update: (value)=> { actual = value; }
        };
        window.events.register(spy, 'show resource');
        calendarResource.digest({ id:'this-id', name:'this-name' }, 0);
        calendarResource.click();
        
        setTimeout(()=>{
            expect(actual).to.deep.equal({ id:'this-id', name:'this-name' });
            done();
        }, 50);
    });
})