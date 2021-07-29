const { expect } = require('chai')
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    ;
const wrapper = `
    var wrapper = (customElements)=> {
        class HTMLElement {};
        ${sut};
        return new CalendarEvent();
    };
    return wrapper({ define:()=>{} });
`;
describe('Calendar Event', ()=>{

    describe('Calendar Event Width', ()=>{

        let event;
        beforeEach(()=>{
            event = (new Function(wrapper))();
        })

        it('works with hours only', ()=>{
            let width = event.width({ start:"2015-09-21 12:00", end:"2015-09-21 15:00" })
            
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

        it('works with values outside of minimals', ()=>{
            let width = event.width({ start:"12:17", end:"15:42" })
            
            expect(width).to.equal(
                'calc(var(--minimalWidth) * (3 * 60 - 17 + 42) / var(--minimalWidthInMinutes))')
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
                'calc(var(--padding) + var(--minimalWidth) * ((12 - var(--opening-hours-start)) * 60 + 0) / var(--minimalWidthInMinutes))')
        })

        it('works with shifted start', ()=>{
            let left = event.left({ start:"12:30", end:"15:00" })
            
            expect(left).to.equal(
                'calc(var(--padding) + var(--minimalWidth) * ((12 - var(--opening-hours-start)) * 60 + 30) / var(--minimalWidthInMinutes))')
        })

        it('works with value outside of minimals', ()=>{
            let left = event.left({ start:"12:15", end:"15:00" })
            
            expect(left).to.equal(
                'calc(var(--padding) + var(--minimalWidth) * ((12 - var(--opening-hours-start)) * 60 + 15) / var(--minimalWidthInMinutes))')
        })
    })
    describe('Calendar Event Top', ()=>{

        let event;
        beforeEach(()=>{
            event = (new Function(wrapper))();
        })

        it('is based on given index', ()=>{
            let top = event.top({ line:15 })
            
            expect(top).to.equal('calc(15 * var(--height) + var(--padding))')
        })
    })
})
