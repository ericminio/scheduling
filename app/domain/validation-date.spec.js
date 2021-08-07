const { expect } = require('chai');
const { isValidDate } = require('.');

describe('Basic Date validation', ()=> {

    it('detects valid date', ()=> {
        expect(isValidDate('2021-12-31')).to.equal(true);
        expect(isValidDate('2015-01-15')).to.equal(true);
    });
    it('detects invalid date', ()=> {
        expect(isValidDate('2021-9-21')).to.equal(false);
    });
    it('detects unwanted extra chars', ()=> {
        expect(isValidDate('before2021-12-31after')).to.equal(false);
    });
})