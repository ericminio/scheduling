class ResourceFactory {

    buildResource(options) {
        return new Promise((resolve, reject)=> {
            resolve(new Resource(options));
        })
    }
};
