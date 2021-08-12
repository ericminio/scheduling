class ResourcesService {
    constructor(store) {
        this.store = store;
        this.cacheById = {};
        this.cacheAll = undefined;
    }
    async save(resource) {
        await this.store.save(resource);
        delete this.cacheById[resource.id];
        this.cacheAll = undefined;
    }
    async delete(id) {
        await this.store.delete(id);
        delete this.cacheById[id];
        this.cacheAll = undefined;
    }
    async get(id) {
        let resource = this.cacheById[id];
        if (resource === undefined) {
            resource = await this.store.get(id);
            this.cacheById[id] = resource;
        }
        return resource;
    }
    async all() {
        let all = this.cacheAll;
        if (all === undefined) {
            all = await this.store.all();
            this.cacheAll = all;
        }
        return all;
    }

}

module.exports = ResourcesService;