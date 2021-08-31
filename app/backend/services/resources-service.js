class ResourcesService {
    constructor(store, cache) {
        this.store = store;
        this.cache = cache;
    }
    async save(resource) {
        await this.store.save(resource);
        this.cache.delete(resource.id);
        this.cache.delete('all');
    }
    async delete(id) {
        await this.store.delete(id);
        this.cache.delete(id);
        this.cache.delete('all');
    }
    async get(id) {
        let resource = this.cache.get(id);
        if (resource === undefined) {
            resource = await this.store.get(id);
            this.cache.put(id, resource);
        }
        return resource;
    }
    async all() {
        let all = this.cache.get('all');
        if (all === undefined) {
            all = await this.store.all();
            this.cache.put('all', all);
        }
        return all;
    }

}

module.exports = ResourcesService;