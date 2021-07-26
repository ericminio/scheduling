class ConfigurationRoute {

    matches(request) {
        return request.url == '/configuration';
    }
    async go(request, response, server) {
        let configuration = await server.services['configuration'].get();
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify(configuration));
        response.end();
    }
}

module.exports = ConfigurationRoute;