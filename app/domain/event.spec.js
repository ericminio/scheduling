const { expect } = require('chai');
const { Event } = require('.');

describe('Event', ()=>{

    it('keeps incoming label', ()=>{
        expect(new Event({ label:'this label' }).getLabel()).to.equal('this label');
    });
    it('keeps incoming notes', ()=>{
        expect(new Event({ notes:'these notes' }).getNotes()).to.equal('these notes');
    });
    it('keeps incoming start time', ()=>{
        expect(new Event({ start:'2015-01-15 19:15' }).getStart()).to.equal('2015-01-15 19:15');
    });
    it('keeps incoming end time', ()=>{
        expect(new Event({ end:'2015-01-16 01:15' }).getEnd()).to.equal('2015-01-16 01:15');
    });

    it('publishes hours and minutes for start time', ()=>{
        expect(new Event({ start:'2015-01-15 19:15' }).getStartInstant()).to.deep.equal({ hours:19, minutes:15 });
    });
    it('publishes hours and minutes for end time', ()=>{
        expect(new Event({ end:'2015-01-15 9:09' }).getEndInstant()).to.deep.equal({ hours:9, minutes:9 });
    });

    it('resists empty label', ()=>{
        expect(new Event({ notes:'without label' }).getLabel()).to.equal('');
    });
    it('resists empty notes', ()=>{
        expect(new Event({ label:'without notes' }).getNotes()).to.equal('');
    });
})