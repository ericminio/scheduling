const { expect } = require('chai');
const { User } = require('..');

describe('User', ()=>{

    it('keeps incoming key', ()=>{
        expect(new User({ key:'any'}).getKey()).to.equal('any');
    })
})