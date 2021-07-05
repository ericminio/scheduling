const { expect } = require('chai')
const sut = require('fs').readFileSync(require('path').join(__dirname, 'calendar-event.js')).toString();
const wrapper = `
    var wrapper = (document, customElements)=> {
        class HTMLElement {};
        ${sut};
        return new CalendarEvent();
    };
    return wrapper({ createElement:()=>{ return {} } }, { define:()=>{} });
`;
    
describe('Calendar Event Width', ()=>{

    let event;
    beforeEach(()=>{
        event = (new Function(wrapper))();
    })

    it('width', ()=>{
        let width = event.width({ start:"12:00", end:"15:00" })
        
        expect(width).to.equal(
            'calc((3 * 60 / var(--minimalWidthInMinutes)) * var(--minimalWidth))')
    })
})