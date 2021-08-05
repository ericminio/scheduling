class User {
    constructor(options) {
        this.id = options.id;
        this.username = options.username;
        this.key = options.key;  
        this.privileges = options.privileges;   
        this.password = options.password;    
    }
    getId() { return this.id; }
    getUsername() { return this.username; }
    getPassword() { return this.password; }
    getKey() { return this.key; }
    getPrivileges() { return this.privileges; }

    setId(id) { this.id = id; }
    setKey(key) { this.key = key; }
};
