const { expect } = require('chai');
const { nextDay } = require('.');

describe('Tomorrow', ()=> {

    it('takes string representation as input', ()=> {
        expect(nextDay('2015-09-20').getTime()).to.equal(
            new Date(2015, 8, 21).getTime());
    });
})