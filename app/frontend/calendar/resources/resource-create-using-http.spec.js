const { expect } = require('chai');
const { code } = require('../../../../yop/utils/files');
const ResourceCreateUsingHttp = code('./frontend/calendar/resources/resource-create-using-http.js', 'ResourceCreateUsingHttp');

describe('Create resource using Http', ()=>{

    let resourceCreate;
    let http = {};
    beforeEach(()=> {
        resourceCreate = new ResourceCreateUsingHttp(http);
    })

    it('exposes resource storage', ()=> {
        let spy = {};
        http.post = (uri, payload)=> { spy = { uri:uri, payload:payload }; }
        resourceCreate.please({ any:42 });

        expect(spy).to.deep.equal({
            uri: '/data/resources/create',
            payload: { any:42 }
        });
    });

})