class CalendarEvent extends HTMLElement {
    constructor() {
        super()
    }
    digest(event, resource) {
        this.id = `event-${event.id}-resource-${resource.id}`;
        this.innerHTML = event.label;
        this.style = `
            top:${this.top(event)}; 
            left:${this.left(event)}; 
            width:${this.width(event)};
        `;
        this.addEventListener('click', (e)=> {
            e.stopPropagation();
            events.notify('show event', event);
        })
    }
    width(event) {
        let start = this.parse(event.start);
        let end = this.parse(event.end);
        return layout.width(start, end);
    }
    left(event) {
        let start = this.parse(event.start);
        return layout.left(start);
    }
    top(event) {
        return layout.top(event.line);
    }
    parse(datetime) {
        let time = datetime.substring(datetime.indexOf(' ')).trim();
        let parts = time.split(':');
        return {
            hours: parseInt(parts[0]),
            minutes: parseInt(parts[1])
        }
    }
};
customElements.define('yop-calendar-event', CalendarEvent);
