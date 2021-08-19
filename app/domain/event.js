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

    getStartInstant() {
        return this.getInstant(this.getStart());
    }
    getEndInstant() {
        return this.getInstant(this.getEnd());
    }
    getInstant(datetime) {
        let time = this.getTimePart(datetime);
        let parts = time.split(':');
        return {
            hours: parseInt(parts[0]),
            minutes: parseInt(parts[1])
        }
    }
    getDatePart(datetime) {
        return datetime.substring(0, datetime.indexOf(' ')).trim();
    }
    getTimePart(datetime) {
        return datetime.substring(datetime.indexOf(' ')).trim();
    }

    getStartWeekdayIndex() {
        return this.getWeekdayIndex(this.getStart());
    }
    getEndWeekdayIndex() {
        return this.getWeekdayIndex(this.getEnd());
    }
    getWeekdayIndex(datetime) {
        let date = dateFrom(this.getDatePart(datetime))
        let day = date.getDay();

        return (day + 6) % 7;
    }
};
