class Guard {
    
    async isAuthorized(request, server) {
        if (request.url == '/sign-in') { return true; }
        if (! (request.url.indexOf('/data/') == 0)) { return true; }

        let key = request.headers ? request.headers['x-user-key'] : undefined;
        if (key === undefined) { return false; }

        let user = await server.services['users'].getUserByKey(key);
        if (user === undefined) { return false; }

        if (request.method == 'GET' && user.getPrivileges().indexOf('read') == -1) { return false; }
        if (request.method != 'GET' && user.getPrivileges().indexOf('write') == -1) { return false; }

        return true;
    }
    
}

module.exports = Guard;