const payload = require('../support/payload');

class SignInRoute {
    constructor(guard) {
        this.guard = guard;
    }

    matches(request) {
        return request.method=='POST' && request.url.indexOf('/sign-in')==0;
    }
    async go(request, response) {
        let incoming = await payload(request);
        let decoded = Buffer.from(incoming.encoded, 'base64').toString('ascii');
        let credentials = JSON.parse(decoded);
        let answer = await this.guard.connect(credentials);
        let body = JSON.stringify({
            username: answer.username,
            key: answer.key
        });
        response.statusCode = answer.key !== undefined ? 200: 403;
        response.setHeader('content-type', 'application/json');
        response.write(body);
        response.end();
    }
}

module.exports = SignInRoute;