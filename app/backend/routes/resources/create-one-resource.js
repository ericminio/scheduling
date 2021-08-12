const payload = require('../../support/payload');

class CreateOneResourceRoute {

    matches(request) {
        return request.method=='POST' && request.url == '/data/resources/create';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        let resource = await server.factory.createResource(incoming);
        await server.services['resources'].save(resource);
        response.statusCode = 201;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ location:'/data/resources/' + resource.id }));
        response.end();
    }
}

module.exports = CreateOneResourceRoute;