class CalendarEvent extends HTMLElement {
    constructor() {
        super()
    }
    digest(event) {
        this.id = `event-${event.id}`;
        this.dataset.width = this.width(event);
        this.dataset.left = this.left(event);
        this.dataset.top = this.top(event);
        this.style = `
            top:${this.dataset.top}; 
            left:${this.dataset.left}; 
            width:${this.dataset.width};
        `;
    }
    width(event) {
        let start = this.parse(event.start);
        let endHour = this.parse(event.end).hours;
        let value = `calc(var(--minimalWidth) * (${endHour - start.hours} * 60) / var(--minimalWidthInMinutes))`;
        if (start.minutes > 0) {
            value = `calc(var(--minimalWidth) * (${endHour - start.hours} * 60 - 30) / var(--minimalWidthInMinutes))`;
        }
        return value;
    }
    left(event) {
        let start = this.parse(event.start);
        let value = `calc(var(--padding) + var(--minimalWidth) * (${start.hours} * 60) / var(--minimalWidthInMinutes))`;
        if (start.minutes > 0) {
            value = `calc(var(--padding) + var(--minimalWidth) * (${start.hours} * 60 + 30) / var(--minimalWidthInMinutes))`;
        }
        return value;
    }
    top(event) {
        return `calc(${event.line} * var(--height) + var(--padding))`;
    }
    parse(time) {
        let parts = time.split(':');
        return {
            hours: parts[0],
            minutes: parts[1]
        }
    }
};
customElements.define('yop-calendar-event', CalendarEvent);
