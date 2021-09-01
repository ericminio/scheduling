class GetResources {

    use(adapters) {
        this.getResources = adapters.getResources;
    }

    async please() {
        return this.getResources.please();
    }
};
