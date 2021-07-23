class SecurityRoute {

    async matches(request, server) {
        let isAuthorized = await server.guard.isAuthorized(request);
        return ! isAuthorized;
    }
    async go(request, response) {
        response.statusCode = 403;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ message: 'forbidden: insufficient privilege' }));
        response.end();
    }
}

module.exports = SecurityRoute;