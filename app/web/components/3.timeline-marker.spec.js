const { expect } = require('chai')
const fs = require('fs');
const path = require('path');
const sut = '' 
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'timeline-marker.js')).toString()
    ;
const wrapper = `
    var wrapper = (customElements)=> {
        class HTMLElement {};
        ${sut};
        return new TimelineMarker();
    };
    return wrapper({ define:()=>{} });
`;
describe('TimelineMarker', ()=>{

    let marker = (new Function(wrapper))();
    let mark = { hours:18, minutes: 0 };

    describe('id', ()=>{

        it('has prefix', ()=>{
            marker.digest(mark)
            
            expect(marker.id).to.equal('hour-1800')
        })
    })

    describe('text', ()=>{

        it('is given value', ()=>{
            marker.digest(mark)
            
            expect(marker.innerHTML).to.equal('18')
        })
    })

    describe('position', ()=>{

        let saved;
        beforeEach(()=>{
            saved = marker.left
        })
        afterEach(()=>{
            marker.left = saved
        })

        it('is computed at digest time', ()=>{
            let spy = {}
            marker.left = (value)=>{ spy.see = value; }
            marker.digest({ data:'value' });

            expect(spy.see).to.deep.equal({ data:'value' })
        })

        it('is as expected', ()=>{
            let expected = 'calc(var(--padding) + var(--minimalWidth) * ((18 - var(--opening-hours-start)) * 60 + 0) / var(--minimalWidthInMinutes))'
            expect(marker.left(mark)).to.equal(expected)
        })
    })
})
