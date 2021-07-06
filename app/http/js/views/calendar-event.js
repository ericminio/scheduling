class CalendarEvent extends HTMLElement {
    constructor() {
        super()
    }
    digest(event) {
        this.id = `event-${event.id}`;
        this.style = `
            top:${this.top(event)}; 
            left:${this.left(event)}; 
            width:${this.width(event)};
        `;
    }
    width(event) {
        let start = this.parse(event.start);
        let end = this.parse(event.end);
        let value = `calc(var(--minimalWidth) * (${end.hours - start.hours} * 60 - ${start.minutes} + ${end.minutes}) / var(--minimalWidthInMinutes))`;
        return value;
    }
    left(event) {
        let start = this.parse(event.start);
        let value = `calc(var(--padding) + var(--minimalWidth) * (${start.hours} * 60 + ${start.minutes}) / var(--minimalWidthInMinutes))`;
        return value;
    }
    top(event) {
        return `calc(${event.line} * var(--height) + var(--padding))`;
    }
    parse(time) {
        let parts = time.split(':');
        return {
            hours: parseInt(parts[0]),
            minutes: parseInt(parts[1])
        }
    }
};
customElements.define('yop-calendar-event', CalendarEvent);
