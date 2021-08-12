class UsersService {
    constructor(store) {
        this.store = store;
        this.cacheByKey = {};
    }

    async saveAssumingPasswordAlreadyEncrypted(user) {
        await this.store.saveAssumingPasswordAlreadyEncrypted(user);
    }
    async savePasswordAssumingAlreadyEncrypted(user) {
        await this.store.savePasswordAssumingAlreadyEncrypted(user);
    }
    async saveKey(user) {
        await this.store.saveKey(user);
        delete this.cacheByKey[user.key];
    }
    async save(user) {
        await this.store.save(user);
    }
    async getUserByUsername(username) {
        return await this.store.getUserByUsername(username);
    }
    async getUserByCredentials(credentials) {
        return await this.store.getUserByCredentials(credentials);
    }
    async getUserByKey(key) {
        let user = this.cacheByKey[key];
        if (user === undefined) {
            user = await this.store.getUserByKey(key);
            this.cacheByKey[key] = user;    
        }
        return user;
    }
}

module.exports = UsersService;