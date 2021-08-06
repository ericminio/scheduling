class CalendarEvent extends HTMLElement {
    constructor() {
        super()
    }
    digest(event, resource) {
        this.id = `event-${event.getId()}-resource-${resource.getId()}`;
        this.innerHTML = event.label;
        this.style = `
            top:${this.top(resource)}; 
            left:${this.left(event)}; 
            width:${this.width(event)};
        `;
        this.addEventListener('click', (e)=> {
            e.stopPropagation();
            events.notify('show event', event);
        })
    }
    width(event) {
        let start = this.parse(event.getStart());
        let end = this.parse(event.getEnd());
        return layout.width(start, end);
    }
    left(event) {
        let start = this.parse(event.getStart());
        return layout.left(start);
    }
    top(resource) {
        return layout.top(resource.getLine());
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
