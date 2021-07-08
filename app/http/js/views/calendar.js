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
        this.displayTimelineMarks([0, 1, 8, 10, 12, 14, 16, 18, 20, 23]);
        api.getResources().then(data => {
            let resources = data.resources;
            this.displayResources(resources)
            api.getEvents().then(data => this.displayEvents(data.events, resources));
        });
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
    displayEvents(events, resources) {
        let view = this.querySelector('events');
        view.style.height = `calc(${resources.length} * var(--height) + 2 * var(--padding))`;
        view.innerHTML = '';
        events.forEach(event => {
            resources.forEach((resource, index)=>{
                if (event.resources.includes(resource.id)) {
                    event.line = index;
                    let instance = new CalendarEvent();
                    instance.digest(event, resource);
                    view.appendChild(instance);   
                }
            });        
        });
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

