const calendarTemplate = document.createElement('template')
calendarTemplate.innerHTML = `

<style>
    .calendar-table {
        width: 100%;    
        border-spacing: 0px;    
    }
    .calendar-table td {
        padding: 0px;
    }
    .column-one {
        width: var(--resourceAreaWidth);
    }
    .column-two {
        width: var(--agendaAreaWidth);
    }
</style>

<div style="position: relative;">
    <table class="calendar-table">
        <tbody>
            <tr>
                <td class="column-one"></td>
                <td class="column-two">
                    <timeline></timeline>
                </td>
            </tr>
            <tr>
                <td class="column-one">
                    <resources></resources>
                </td>
                <td class="column-two">
                    <events></events>                    
                    <show-resource></show-resource>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;

class Calendar extends HTMLElement {

    constructor() {
        super()
    }
    async connectedCallback() {
        this.appendChild(calendarTemplate.content.cloneNode(true))
        this.displayTimelineMarks([0, 1, 8, 10, 12, 14, 16, 18, 20, 23]);
        this.querySelector('events').addEventListener('click', (e)=>{
            events.notify('event creation');
        });
        events.register(this, 'resource created');
        events.register(this, 'event created');
        events.register(this, 'event deleted');
        events.register(this, 'resource deleted');        
        this.update();        
    }
    update() {
        api.getResources()
            .then(data => {
                let resources = data.resources;
                this.displayResources(resources)
                api.getEvents().then(data => this.displayEvents(data.events, resources));
                store.saveObject('resources', resources);
            })
            .catch(()=> { store.delete('resources'); });
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
        view.style.height = layout.totalHeight(resources.length);
        view.innerHTML = '';
        events.forEach(event => {
            event.resources.forEach((eventResource)=> {
                resources.forEach((resource, index)=>{
                    if (eventResource.id == resource.id) {
                        event.line = index;
                        let instance = new CalendarEvent();
                        instance.digest(event, resource);
                        view.appendChild(instance);   
                    }
                });            
            })
        });
    }
    displayResources(resources) {
        let view = this.querySelector('resources');
        view.style.height = layout.totalHeight(resources.length);
        view.innerHTML = '';
        resources.forEach((data, index) => {
            let instance = new Resource();
            instance.digest(data, index);
            view.appendChild(instance);
        })
    }
};
customElements.define('yop-calendar', Calendar);

