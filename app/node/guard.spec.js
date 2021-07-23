const { expect } = require('chai');
const Guard = require('./guard')

describe('Guard', ()=>{

    let guard;
    beforeEach(()=>{
        guard = new Guard();
    })

    it('allows sign-in request', async ()=>{
        let request = {
            method: 'POST',
            url: '/sign-in'
        };
        let authorized = await guard.isAuthorized(request);
        expect(authorized).to.equal(true);
    });
});