const { expect } = require('chai');
const { nextDay, previousDay } = require('.');

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