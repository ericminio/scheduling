class ResourceFactory {

    async buildResource(options) {
        if (options.id === undefined) {
            options.id = this.idGenerator.next();
        }
        return new Resource(options);
    }
};
