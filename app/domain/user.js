class User {
    constructor(options) {
        this.id = options.id;
        this.username = options.username;
        this.key = options.key;        
    }
    getId() { return this.id; }
    getUsername() { return this.username; }
    getKey() { return this.key; }

    setKey(key) { this.key = key; }
}

module.exports = User;