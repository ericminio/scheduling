const payload = require('../support/payload');
const NextUuid = require('../../domain/next-uuid')

class SignInRoute {
    constructor() {
        this.keyGenerator = new NextUuid();
    }

    matches(request) {
        return request.method=='POST' && request.url.indexOf('/sign-in')==0;
    }
    async go(request, response, server) {
        let incoming = await payload(request);
        let decoded = Buffer.from(incoming.encoded, 'base64').toString('ascii');
        let credentials = JSON.parse(decoded);
        let user = await server.services['users'].getUserByCredentials(credentials);

        if (user) {
            let key = this.keyGenerator.next();
            user.setKey(key);
            await server.services['users'].save(user);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify({ username: user.username, key:key }));
        }
        else {
            response.statusCode = 401;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify({ username: credentials.username }));
        }
        response.end();
    }
}

module.exports = SignInRoute;