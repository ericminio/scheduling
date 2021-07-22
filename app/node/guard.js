class Guard {
    
    async connect(credentials) {
        return {
            status: 'authorized',
            username: credentials.username,
            key: 'this-key'
        }
    }
    async isAuthorized(request) {
        let debug = `${request.method} ${request.url} ${request.headers['x-user-key']}`;
        console.log(debug)
        return {
            status: 'not authorized'
        }
    }
    
}

module.exports = Guard;