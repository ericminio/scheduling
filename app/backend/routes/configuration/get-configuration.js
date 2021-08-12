class GetConfigurationRoute {

    matches(request) {
        return request.method == 'GET' && request.url == '/data/configuration';
    }
    async go(request, response, server) {
        let configuration = await server.services['configuration'].get();
        if (configuration) {
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify(configuration));
        }
        else {
            response.statusCode = 404;
            response.setHeader('content-type', 'text/plain');
            response.write('NOT FOUND');
        }
        response.end();
    }
}

module.exports = GetConfigurationRoute;