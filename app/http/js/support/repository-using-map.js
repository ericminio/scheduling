class RepositoryUsingMap {
    constructor() {
        this.store = [];
    }
    save(instance) {
        this.store.push(instance);
        return instance.id;
    }
    get(id) {
        return this.store.find(instance => instance.id == id);
    }
    all() {
        return this.store;
    }
};

module.exports = RepositoryUsingMap;