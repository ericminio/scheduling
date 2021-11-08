const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");

describe('Day selection - previous day', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-day-selection></yop-day-selection>
                <script>
                    ${yop}
                    ${domain}
                    ${data}                    
                    today = ()=> { return new Date(2015, 6, 1); }
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let wait = 1;
    let previousDay;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        previousDay = document.querySelector('#calendar-previous-day');
        setTimeout(done, wait);
    })

    it('initializes calendar date field with previous day', ()=>{
        previousDay.click();
        let field = document.querySelector('#calendar-date');
        expect(field.value).to.equal('2015-06-30');
    });
    it('updates week day', ()=>{
        previousDay.click();
        let field = document.querySelector('#calendar-date-day-name');
        expect(field.innerHTML).to.equal('Tuesday');
    });
    it('notifies', ()=>{
        let spy;
        window.eventBus.register({ update:(value)=> { spy = value; } }, 'calendar update');
        previousDay.click();

        expect(spy).to.deep.equal('2015-06-30');
    });
})