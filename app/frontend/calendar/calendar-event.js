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
            eventBus.notify('show event', event);
        })
    }
    width(event) {
        let start = event.getStartInstant();
        let end = event.getEndInstant();
        return layout.width(start, end);
    }
    left(event) {
        return layout.left(event.getStartInstant());
    }
    top(resource) {
        return layout.top(resource.getLine());
    }
};
customElements.define('yop-calendar-event', CalendarEvent);
