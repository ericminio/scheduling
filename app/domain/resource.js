class Resource {
    constructor(options) {
        this.id = options.id;
        this.type = options.type;
        this.name = options.name;
        this.line = options.line;
    }

    getId() { return this.id; }
    getType() { return this.type; }
    getName() { return this.name; }
    getLine() { return this.line; }
};
