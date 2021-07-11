class Resource {
    constructor(options) {
        this.id = options.id;
        this.type = options.type;
        this.name = options.name;
    }

    getId() { return this.id; }
    getType() { return this.type; }
    getName() { return this.name; }
};

module.exports = Resource;
