const { GetResources } = require('../../../domain');

class GetAllResourcesRoute {
    constructor() {
        this.getResources = new GetResources();
    }

    matches(request) {
        return request.method=='GET' && request.url == '/data/resources';
    }
    async go(request, response, server) {
        this.getResources.use(server.adapters);
        return this.getResources.please()
            .then(resources=>{
                response.statusCode = 200;
                response.setHeader('content-type', 'application/json');
                response.write(JSON.stringify({ resources:resources }));
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

module.exports = GetAllResourcesRoute;