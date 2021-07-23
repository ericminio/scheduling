class GetAllResourcesRoute {

    matches(request) {
        return request.method=='GET' && request.url == '/data/resources';
    }
    async go(request, response, server) {
        let resources = await server.services['resources'].all();
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ resources:resources }));
        response.end();
    }
}

module.exports = GetAllResourcesRoute;