class User {
    constructor(options) {
        this.id = options.id;
        this.username = options.username;
        this.key = options.key;  
        this.privileges = options.privileges;       
    }
    getId() { return this.id; }
    getUsername() { return this.username; }
    getKey() { return this.key; }
    getPrivileges() { return this.privileges; }

    setKey(key) { this.key = key; }
}

module.exports = User;