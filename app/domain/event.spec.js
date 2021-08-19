const { expect } = require('chai');
const { Event, dateFrom } = require('.');
const Sut = (new Function(`var dateFrom=${dateFrom}; ${Event}; return Event;`))();

describe('Event', ()=>{

    it('keeps incoming start time', ()=>{
        expect(new Sut({ start:'2015-01-15 19:15' }).getStart()).to.equal('2015-01-15 19:15');
    });
    it('keeps incoming end time', ()=>{
        expect(new Sut({ end:'2015-01-16 01:15' }).getEnd()).to.equal('2015-01-16 01:15');
    });

    it('publishes hours and minutes for start time', ()=>{
        expect(new Sut({ start:'2015-01-15 19:15' }).getStartInstant()).to.deep.equal({ hours:19, minutes:15 });
    });
    it('publishes hours and minutes for end time', ()=>{
        expect(new Sut({ end:'2015-01-15 9:09' }).getEndInstant()).to.deep.equal({ hours:9, minutes:9 });
    });

    it('publishes weekday index of start time', ()=>{
        expect(new Sut({ start:'2021-09-21 19:15' }).getStartWeekdayIndex()).to.equal(1);
    });
    it('publishes weekday index of end time', ()=>{
        expect(new Sut({ end:'2021-09-22 19:15' }).getEndWeekdayIndex()).to.equal(2);
    });
})