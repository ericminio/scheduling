const { expect } = require('chai')
const sut = require('fs').readFileSync(require('path').join(__dirname, 'timeline-marker.js')).toString();
const wrapper = `
    var wrapper = (customElements)=> {
        class HTMLElement {};
        ${sut};
        return new TimelineMarker();
    };
    return wrapper({ define:()=>{} });
`;
describe('TimelineMarker', ()=>{

    let marker;
    beforeEach(()=>{
        marker = (new Function(wrapper))();
    })

    describe('id', ()=>{

        it('has prefix', ()=>{
            marker.digest(18)
            
            expect(marker.id).to.equal('hour-1800')
        })
    })

    describe('text', ()=>{

        it('is given value', ()=>{
            marker.digest(18)
            
            expect(marker.innerHTML).to.equal('18')
        })
    })

    describe('position', ()=>{

        it('is as expected', ()=>{
            let expected = 'calc(var(--padding) + var(--minimalWidth) * (18 * 60 + 0) / var(--minimalWidthInMinutes))'
            expect(marker.left(18)).to.equal(expected)
        })
    })
})
