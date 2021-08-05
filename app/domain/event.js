class Event {
    constructor(options) {
        this.id = options.id;
        this.label = options.label;
        this.start = options.start;
        this.end = options.end;
        this.resources = options.resources;
    }

    getId() { return this.id; }
    getLabel() { return this.label; }
    getStart() { return this.start; }
    getEnd() { return this.end; }
    getResources() { return this.resources; }

    setResources(resources) {
        this.resources = resources;
    }
};
