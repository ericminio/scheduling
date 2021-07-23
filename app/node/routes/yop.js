class YopRoute {

    matches(request) {
        return request.url == '/yop.js'
    }
    async go(request, response) {
        response.statusCode = 200;
        response.setHeader('content-type', 'application/javascript');
        response.write(require('../../web/yop'));
        response.end();
    }
}

module.exports = YopRoute;