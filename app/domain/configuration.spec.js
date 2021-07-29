const { expect } = require('chai');
const { Configuration } = require('.');


describe('Configuration', ()=>{

    it('provides defaut title', ()=>{
        expect(new Configuration({}).getTitle()).to.equal('Yop');
    })
    it('provides defaut opening hours', ()=>{
        expect(new Configuration({}).getOpeningHours()).to.equal('0-24');
    })
})