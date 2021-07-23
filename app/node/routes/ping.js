class Ping {

    matches(request) {
        return request.url == '/ping'
    }
    async go(request, response) {
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.write(JSON.stringify({ alive:true }));
        response.end();
    }
}

module.exports = Ping;