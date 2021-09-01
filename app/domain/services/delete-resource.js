class DeleteResource {

    use(adapters) {
        this.deleteResource = adapters.deleteResource;
    }

    please(resource) {
        return this.deleteResource.please(resource);
    }
};