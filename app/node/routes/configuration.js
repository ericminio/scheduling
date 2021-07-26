class ConfigurationRoute {

    matches(request) {
        return request.url == '/configuration';
    }
    async go(request, response) {
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ title:'The world of Max' }));
        response.end();
    }
}

module.exports = ConfigurationRoute;