const { expect } = require('chai');
const { nextDay, previousDay, formatDate, weekday } = require('..');

describe('The next day', ()=> {

    it('takes string representation as input', ()=> {
        expect(nextDay('2015-09-20').getTime()).to.equal(
            new Date(2015, 8, 21).getTime());
    });
    it('knows about end of year', ()=> {
        expect(nextDay('2015-12-31').getTime()).to.equal(
            new Date(2016, 0, 1).getTime());
    });
});

describe('The previous day', ()=> {

    it('takes string representation as input', ()=> {
        expect(previousDay('2015-09-22').getTime()).to.equal(
            new Date(2015, 8, 21).getTime());
    });
    it('knows about beginning of year', ()=> {
        expect(previousDay('2016-01-01').getTime()).to.equal(
            new Date(2015, 11, 31).getTime());
    });
});

describe('date formater', ()=> {

    it('uses yyyy-mm-dd', ()=> {
        let date = new Date(2015, 8, 21);
        expect(formatDate(date)).to.equal('2015-09-21');
    })
});

describe('weekday', ()=> {

    it('is Monday for 2015-09-21', ()=> {
        let day = '2015-09-21'
        expect(weekday(day)).to.equal('Monday');
    });
    it('is Thursday for 1972-09-21', ()=> {
        let day = '1972-09-21'
        expect(weekday(day)).to.equal('Thursday');
    });
})