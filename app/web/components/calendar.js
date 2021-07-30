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
        await this.displayTimelineMarks();
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
        let resourcesLoaded = api.getResources();
        resourcesLoaded
            .then(data => {
                this.displayResources(data.resources)
                store.saveObject('resources', data.resources);
            })
            .catch(()=> { 
                store.delete('resources'); 
                events.notify('maybe signed-out')
            });
        let eventsLoaded = api.getEvents();
        eventsLoaded.then(data => this.events = data.events);

        Promise.all([resourcesLoaded, eventsLoaded]).then(()=> { this.displayEvents(); })
    }
    async displayTimelineMarks() {
        let configuration = store.getObject('configuration');
        if (configuration === null || 
            configuration.title === undefined ||
            configuration['opening-hours'] === undefined) {
            configuration = await api.configuration();
            store.saveObject('configuration', configuration);            
        }
        let openingHours = configuration['opening-hours'];
        let parts = openingHours.split('-');
        let end = parseInt(parts[1])
        let current = parseInt(parts[0])
        let starts = [];
        while (current < end) {
            starts = starts.concat(current);
            current ++;
        }

        let view = this.querySelector('timeline');
        view.innerHTML = '';
        starts.forEach((start)=>{
            let marker = new TimelineMarker();
            marker.digest({ hours:start, minutes:0 });
            view.appendChild(marker);
        })
    }
    displayResources(resources) {
        this.clear(resources.length);
        let view = this.querySelector('resources');
        this.resourceMap = {};
        resources.forEach((resource, index) => {
            this.resourceMap[resource.id] = resource; 
            let instance = new Resource();
            instance.digest(resource, index);
            view.appendChild(instance);
        });
    }
    displayEvents() {
        let view = this.querySelector('events');
        this.events.forEach(event => {
            event.resources.forEach((eventResource)=> {
                let resource = this.resourceMap[eventResource.id];
                let instance = new CalendarEvent();
                instance.digest(event, resource);
                view.appendChild(instance);
            });
        });
    }
    clear(size) {
        let events = this.querySelector('events');
        events.innerHTML = '';
        events.style.height = layout.totalHeight(size);
        let resources = this.querySelector('resources');
        resources.innerHTML = '';
        resources.style.height = layout.totalHeight(size);
    }
};
customElements.define('yop-calendar', Calendar);

