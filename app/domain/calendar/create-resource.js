class CreateResource {
    constructor() {
        this.resourceFactory = new ResourceFactory();
    }

    use(adapters) {
        this.storeResource = adapters.storeResource;
    }

    async please(incoming) {
        return this.resourceFactory.buildResource(incoming)
                .then((resource)=> {
                    return this.storeResource.please(resource);
                });
    }
};
