const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");

describe('Day selection', ()=>{

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
    let wait = 10;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        setTimeout(done, wait);
    })

    it('initializes calendar date field with today', ()=>{
        let field = document.querySelector('#calendar-date');
        expect(field.value).to.equal('2015-07-01');
    });
    it('initializes week day name with today', ()=>{
        let field = document.querySelector('#calendar-date-day-name');
        expect(field.innerHTML).to.equal('Wednesday');
    });
    it('updates week day name', ()=>{
        document.querySelector('#calendar-date').value = '2015-07-02';
        document.querySelector('#calendar-search').click();
        let field = document.querySelector('#calendar-date-day-name');
        expect(field.innerHTML).to.equal('Thursday');
    });
    it('clears week day name on invalid date', ()=>{
        document.querySelector('#calendar-date').value = '2015-07-2';
        document.querySelector('#calendar-search').click();
        let field = document.querySelector('#calendar-date-day-name');
        expect(field.innerHTML).to.equal('');
    });
    it('alerts on invalid date', ()=>{
        let field = document.querySelector('#calendar-date');
        field.value = '2015-9-21';
        let spy;
        window.events.register({ update:(value)=> { spy = value; } }, 'error');
        document.querySelector('#calendar-search').click();

        expect(spy).to.deep.equal({ message:'Invalid date. Expected format is yyyy-mm-dd' });
    });
    it('notifies on valid date', ()=>{
        let field = document.querySelector('#calendar-date');
        field.value = '2015-09-21';
        let spy;
        window.events.register({ update:(value)=> { spy = value; } }, 'calendar update');
        document.querySelector('#calendar-search').click();

        expect(spy).to.deep.equal('2015-09-21');
    });
    describe('calendar day keyup', ()=>{

        it('updates day name', ()=>{
            let field = document.querySelector('#calendar-date');
            field.value = '2021-09-21';
            let keyupEvent = new window.CustomEvent('keyup');
            field.dispatchEvent(keyupEvent);

            expect(document.querySelector('#calendar-date-day-name').innerHTML).to.equal('Tuesday');
        });

        it('notifies on Enter key', ()=>{
            let spy;
            window.events.register({ update:(value)=> { spy = value; } }, 'calendar update');
            let field = document.querySelector('#calendar-date');
            field.value = '2021-09-21';
            let keyupEvent = new window.CustomEvent('keyup');
            keyupEvent.key = 'Enter';
            field.dispatchEvent(keyupEvent);

            expect(spy).to.deep.equal('2021-09-21');
        });

        it('notifies on Enter key only', ()=>{
            let spy;
            window.events.register({ update:(value)=> { spy = value; } }, 'calendar update');
            let field = document.querySelector('#calendar-date');
            field.value = '2021-09-21';
            let keyupEvent = new window.CustomEvent('keyup');
            keyupEvent.key = '1';
            field.dispatchEvent(keyupEvent);

            expect(spy).to.deep.equal(undefined);
        });
    })
})