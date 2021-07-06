const { expect } = require('chai')
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    ;
const wrapper = `
    var wrapper = (document, customElements)=> {
        class HTMLElement {};
        ${sut};
        return new CalendarEvent();
    };
    return wrapper({ createElement:()=>{ return {} } }, { define:()=>{} });
`;
describe('Calendar Event', ()=>{

    describe('Calendar Event Width', ()=>{

        let event;
        beforeEach(()=>{
            event = (new Function(wrapper))();
        })

        it('works with hours only', ()=>{
            let width = event.width({ start:"12:00", end:"15:00" })
            
            expect(width).to.equal(
                'calc(var(--minimalWidth) * (3 * 60 - 0 + 0) / var(--minimalWidthInMinutes))')
        })

        it('works with shifted start', ()=>{
            let width = event.width({ start:"12:30", end:"15:00" })
            
            expect(width).to.equal(
                'calc(var(--minimalWidth) * (3 * 60 - 30 + 0) / var(--minimalWidthInMinutes))')
        })

        it('works with shifted end', ()=>{
            let width = event.width({ start:"12:00", end:"15:30" })
            
            expect(width).to.equal(
                'calc(var(--minimalWidth) * (3 * 60 - 0 + 30) / var(--minimalWidthInMinutes))')
        })

        it('works with shifted start and end', ()=>{
            let width = event.width({ start:"12:30", end:"15:30" })
            
            expect(width).to.equal(
                'calc(var(--minimalWidth) * (3 * 60 - 30 + 30) / var(--minimalWidthInMinutes))')
        })
    })
    describe('Calendar Event Left', ()=>{

        let event;
        beforeEach(()=>{
            event = (new Function(wrapper))();
        })

        it('works with hours only', ()=>{
            let left = event.left({ start:"12:00", end:"15:00" })
            
            expect(left).to.equal(
                'calc(var(--padding) + var(--minimalWidth) * (12 * 60 + 0) / var(--minimalWidthInMinutes))')
        })

        it('works with shifted start', ()=>{
            let left = event.left({ start:"12:30", end:"15:00" })
            
            expect(left).to.equal(
                'calc(var(--padding) + var(--minimalWidth) * (12 * 60 + 30) / var(--minimalWidthInMinutes))')
        })
    })
})
