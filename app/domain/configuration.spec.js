const { expect } = require('chai');
const { Configuration } = require('.');


describe('Configuration', ()=>{

    it('provides defaut title', ()=>{
        expect(new Configuration({}).getTitle()).to.equal('Yop');
    })
})