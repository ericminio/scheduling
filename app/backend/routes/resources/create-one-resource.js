const payload = require('../../support/payload');
const { CreateResourceWithDependencies } = require('../../../domain')

class CreateOneResourceRoute {
    constructor() {
        this.createResource = new CreateResourceWithDependencies();
    }

    matches(request) {
        return request.method=='POST' && request.url == '/data/resources/create';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        this.createResource.use(server.adapters);
        this.createResource.please(incoming)
            .then((resource)=>{
                response.statusCode = 201;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ location:'/data/resources/' + resource.id }));                
            })
            .catch((error)=> {
                response.statusCode = 400;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:error.message }));
            })
            .finally(()=>{ response.end(); });
    }
}

module.exports = CreateOneResourceRoute;