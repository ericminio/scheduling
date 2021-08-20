class Event {
    constructor(options) {
        this.id = options.id;
        this.label = options.label || '';
        this.notes = options.notes || '';
        this.start = options.start;
        this.end = options.end;
        this.resources = options.resources;
    }

    getId() { return this.id; }
    getLabel() { return this.label; }
    getNotes() { return this.notes; }
    getStart() { return this.start; }
    getEnd() { return this.end; }
    getResources() { return this.resources; }

    setResources(resources) {
        this.resources = resources;
    }

    getStartInstant() {
        return this.getInstant(this.getStart());
    }
    getEndInstant() {
        return this.getInstant(this.getEnd());
    }
    getInstant(datetime) {
        let time = datetime.substring(datetime.indexOf(' ')).trim();
        let parts = time.split(':');
        return {
            hours: parseInt(parts[0]),
            minutes: parseInt(parts[1])
        }
    }
};
