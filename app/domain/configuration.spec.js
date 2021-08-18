const { expect } = require('chai');
const { Configuration } = require('.');

describe('Configuration', ()=>{

    it('provides defaut title', ()=>{
        expect(new Configuration({}).getTitle()).to.equal('Yop');
    });
    it('provides defaut opening hours', ()=>{
        expect(new Configuration({}).getOpeningHours()).to.equal('0-24');
    });
    it('provides opening hours start', ()=>{
        let configuration = new Configuration({'opening-hours':'8-10'});
        expect(configuration.getOpeningHoursStart()).to.equal(8);
    });
    it('provides opening hours end', ()=>{
        let configuration = new Configuration({'opening-hours':'8-10'});
        expect(configuration.getOpeningHoursEnd()).to.equal(10);
    });
})