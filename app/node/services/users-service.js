class UsersService {
    constructor(repository) {
        this.repository = repository;
        this.keyMap = {};
    }

    async save(user) {
        await this.repository.save(user);
    }

    async saveKey(user) {
        await this.repository.saveKey(user);
        this.keyMap[user.key] = user;
    }

    async getUserByKey(key) {
        return this.keyMap[key];
    }
}

module.exports = UsersService;