class Guard {
    
    async connect(credentials) {
        if (credentials.username == 'Joe') {
            return {
                username: credentials.username,
                key: 'key-for-joe'
            }
        }
        return {
            username: credentials.username,
            key: 'this-key'
        }
    }
    async isAuthorized(request) {
        if (request.method=='DELETE' && request.url.indexOf('/data/events/')==0) {
            let key = request.headers['x-user-key'];
            return key == 'key-for-joe' ? false : true;
        }
        return true;
    }
    
}

module.exports = Guard;