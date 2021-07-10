class RepositoryUsingMap {
    constructor() {
        this.store = [];
    }
    async save(instance) {
        this.store.push(instance);
        return instance.id;
    }
    async get(id) {
        return this.store.find(instance => instance.id == id);
    }
    async all() {
        return this.store;
    }
};

module.exports = RepositoryUsingMap;