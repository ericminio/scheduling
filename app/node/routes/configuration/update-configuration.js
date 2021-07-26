const payload = require("../../support/payload");

class GetConfigurationRoute {

    matches(request) {
        return request.method == 'POST' && request.url == '/configuration';
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        await server.services['configuration'].save(incoming);
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ message:'configuration updated' }));
        response.end();
    }
}

module.exports = GetConfigurationRoute;