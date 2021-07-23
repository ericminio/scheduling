class DeleteOneResource {

    matches(request) {
        return request.method=='DELETE' && request.url.indexOf('/data/resources/')==0;
    }
    async go(request, response, server) {
        let id = request.url.substring('/data/resources/'.length);
        let instance = await server.services['resources'].get(id);
        if (instance) {
            await server.services['resources'].delete(id);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.write(JSON.stringify({ message:'resource deleted' }));
        } else {
            response.statusCode = 404;
            response.setHeader('content-type', 'text/plain');
            response.write('NOT FOUND');
        }
        response.end();
    }
}

module.exports = DeleteOneResource;