class Guard {
    
    async isAuthorized(request) {
        if (request.method=='DELETE' && 
            request.url.indexOf('/data/events/')==0 &&
            request.headers['x-user-key'] == 'key-for-joe') {
                return false;
        }
        return true;
    }
    
}

module.exports = Guard;