class RepositoryUsingMap {
    constructor() {
        this.store = [];
    }
    async save(instance) {
        this.store.push(instance);
    }
    async get(id) {
        return this.store.find(instance => instance.id == id);
    }
    async all() {
        return this.store;
    }
    async exists(id) {
        return (await this.get(id)) !== undefined;
    }
    async delete(id) {
        let instance = this.get(id);
        this.store.splice(this.store.indexOf(instance), 1);
    }

    async getUserByCredentials(credentials) { 
        return this.store.find(instance => instance.username == credentials.username);
    }
    async getUserByKey(key) { 
        return this.store.find(instance => instance.key == key);
    }
    
};

module.exports = RepositoryUsingMap;