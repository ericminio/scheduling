const { expect } = require('chai');
const { code } = require('../../../utils/files');
const GetResourcesUsingHttp = code('./frontend/calendar/resources/get-resources-using-http.js', 'GetResourcesUsingHttp');

describe('Get resources using Http', ()=>{

    let getResources;
    let http = {};
    beforeEach(()=> {
        getResources = new GetResourcesUsingHttp(http);
    })

    it('exposes resource delete', ()=> {
        let spy = {};
        http.get = (uri)=> { spy = { uri:uri }; }
        getResources.please();

        expect(spy).to.deep.equal({
            uri: '/data/resources'
        });
    });

})