const { expect } = require('chai');
const { code } = require('../../../../yop/utils/files');
const DeleteResourceUsingHttp = code('./frontend/calendar/resources/delete-resource-using-http.js', 'DeleteResourceUsingHttp');
const { Resource } = require('../../../domain')

describe('Resource delete using Http', ()=>{

    let deleteResource;
    let http = {};
    beforeEach(()=> {
        deleteResource = new DeleteResourceUsingHttp(http);
    })

    it('exposes resource delete', ()=> {
        let spy = {};
        http.delete = (uri)=> { spy = { uri:uri }; }
        deleteResource.please(new Resource({ id:42 }));

        expect(spy).to.deep.equal({
            uri: '/data/resources/42'
        });
    });

})