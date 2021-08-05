const { expect } = require('chai');
const { Event } = require('.');

describe('Event', ()=>{

    it('keeps incoming start time', ()=>{
        expect(new Event({ start:'2015-01-15 19:15' }).getStart()).to.equal('2015-01-15 19:15');
    })
    it('keeps incoming end time', ()=>{
        expect(new Event({ end:'2015-01-16 01:15' }).getEnd()).to.equal('2015-01-16 01:15');
    })
})