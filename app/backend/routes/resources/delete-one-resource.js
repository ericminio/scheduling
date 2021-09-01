const { DeleteResource, Resource } = require('../../../domain');

class DeleteOneResource {
    constructor() {
        this.deleteResource = new DeleteResource();
    }

    matches(request) {
        return request.method=='DELETE' && request.url.indexOf('/data/resources/')==0;
    }
    async go(request, response, server) {
        let id = request.url.substring('/data/resources/'.length);
        this.deleteResource.use(server.adapters);
        return this.deleteResource.please(new Resource({ id:id }))
            .then(()=>{
                response.statusCode = 200;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:'Resource deleted' }));
            })
            .catch((error)=>{
                response.statusCode = 400;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ message:error.message }));
            })
            .finally(()=>{
                response.end();
            });
    }
}

module.exports = DeleteOneResource;