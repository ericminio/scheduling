const { expect } = require('chai');
const { codes } = require('../../../../yop/utils/files');
const GetResourcesUsingHttp = codes([
    './domain/calendar/resource.js',
    './frontend/calendar/resources/get-resources-using-http.js'
    ], 'GetResourcesUsingHttp'
);

describe('Get resources using Http', ()=>{

    let getResources;
    let http = {};
    beforeEach(()=> {
        getResources = new GetResourcesUsingHttp(http);
    });

    it('exposes resource delete', ()=> {
        let spy = {};
        http.get = (uri)=> { spy = { uri:uri }; }
        getResources.please();

        expect(spy).to.deep.equal({
            uri: '/data/resources'
        });
    });

    it('returns a collection of resources', (done)=> {
        http.get = ()=> new Promise((resolve, reject)=> {
            resolve({ resources:[{ id:42 }] });
        });
        getResources.please()
            .then(data => {
                expect(data.resources.length).to.equal(1);
                expect(data.resources[0].getId()).to.equal(42);
                done();
            })
            .catch(error => done(error))
    });

})