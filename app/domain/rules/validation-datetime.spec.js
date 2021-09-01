const { expect } = require('chai');
const { isValidDatetime } = require('..');

describe('Basic Datetime validation', ()=> {

    it('detects valid datetime', ()=> {
        expect(isValidDatetime('2021-12-31 15:20')).to.equal(true);
        expect(isValidDatetime('2015-01-15 08:05')).to.equal(true);
    });
    it('detects invalid datetime', ()=> {
        expect(isValidDatetime('2021-09-21 8:15')).to.equal(false);
        expect(isValidDatetime('2021-09-21 815')).to.equal(false);
        expect(isValidDatetime('2021-09-21  08:15')).to.equal(false);
        expect(isValidDatetime('2021-09-2108:15')).to.equal(false);
    });
    it('detects unwanted extra chars', ()=> {
        expect(isValidDatetime('before2021-12-31 08:05after')).to.equal(false);
    });
})