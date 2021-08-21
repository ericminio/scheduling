const { expect } = require('chai');
const { Resource } = require('..');

describe('Resource', ()=>{

    it('keeps given line', ()=>{
        expect(new Resource({ line:3 }).getLine()).to.equal(3);
    })
})