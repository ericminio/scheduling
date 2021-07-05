const { expect } = require('chai')
const sut = require('fs').readFileSync(require('path').join(__dirname, 'calendar-event.js')).toString();

describe('Calendar Event', ()=>{

    it('width', ()=>{
        var wrapper = `
            var wrapper = (document, customElements)=> {
                class HTMLElement {};
                ${sut};
                return new CalendarEvent();
            };
            return wrapper({ createElement:()=>{ return {} } }, { define:()=>{} });
        `;
        var event = (new Function(wrapper))();
        let width = event.width({ start:"12:00", end:"15:00" })
        
        expect(width).to.equal('calc((3 * 2 + 0) * var(--halfHourWidth))')
    })
})