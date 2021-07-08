const calendarTemplate = document.createElement('template')
calendarTemplate.innerHTML = `
<resources></resources>
<timeline></timeline>
<events></events>
`;

class Calendar extends HTMLElement {

    constructor() {
        super()
    }
    async connectedCallback() {
        this.appendChild(calendarTemplate.content.cloneNode(true))
        this.displayTimelineMarks([0, 1, 8, 10, 12, 14, 16, 18, 20, 23, 24]);
        api.getEvents().then(data => this.displayEvents(data.events));
        api.getResources().then(data => this.displayResources(data.resources));
    }
    displayTimelineMarks(starts) {
        let view = this.querySelector('timeline');
        view.innerHTML = '';
        starts.forEach((start)=>{
            let marker = new TimelineMarker();
            marker.digest({ hours:start, minutes:0 });
            view.appendChild(marker);
        })
    }
    displayEvents(events) {
        let view = this.querySelector('events');
        view.innerHTML = '';
        let maxLine = 0;
        events.forEach(event => {
            let instance = new CalendarEvent();
            instance.digest(event);
            view.appendChild(instance);     
            if (event.line > maxLine) {
                maxLine = event.line
            }           
        });
        let lineCount = maxLine + 1;
        view.style.height = `calc(${lineCount} * var(--height) + 2 * var(--padding))`;
    }
    displayResources(resources) {
        let view = this.querySelector('resources');
        view.innerHTML = '';
        resources.forEach((data, index) => {
            let instance = new Resource();
            instance.digest(data, index);
            view.appendChild(instance);
        })
    }
};
customElements.define('yop-calendar', Calendar);

