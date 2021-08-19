const calendarWeekTemplate = document.createElement('template')
calendarWeekTemplate.innerHTML = `

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
                    <yop-day-selection></yop-day-selection>
                    <yop-timeline-week></yop-timeline-week>
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

class CalendarWeek extends HTMLElement {

    constructor() {
        super()
    }
    async connectedCallback() {
        this.appendChild(calendarWeekTemplate.content.cloneNode(true));
        events.register(this, 'calendar update');
        this.update();
    }
    update() {
        let date = this.querySelector("#calendar-date").value;
        if (isValidDate(date)) {
            this.updateResourcesAndEvents(date);
        }
        else {
            events.notify('error', { message:'Invalid date. Expected format is yyyy-mm-dd' });
        }
    }
    updateResourcesAndEvents(date) {
        let resourcesLoaded = data.getResources();
        resourcesLoaded
            .then(data => {
                this.resources = data.resources;
                this.resourceMap = {};
                this.resources.forEach((resource) => {
                    this.resourceMap[resource.getId()] = resource; 
                });
                store.saveObject('resources', data.resources);
            })
            .catch(()=> { 
                store.delete('resources'); 
                events.notify('maybe signed-out')
            });
        let eventsLoaded = data.getEvents(date);
        eventsLoaded.then(data => this.events = data.events);

        Promise.all([resourcesLoaded, eventsLoaded]).then(()=> { 
            this.clear();
            this.displayResources();
            this.displayEvents(); 
        })
    }
    clear() {
        let size = this.resources.length;
        let events = this.querySelector('events');
        events.innerHTML = '';
        events.style.height = layout.totalHeight(size);
        let resources = this.querySelector('resources');
        resources.innerHTML = '';
        resources.style.height = layout.totalHeight(size);
    }
    displayResources() {
        let view = this.querySelector('resources');
        this.resources.forEach((resource, index) => {
            let instance = new ResourceRenderer();
            instance.digest(resource, index);
            view.appendChild(instance);
        });
    }
    displayEvents() {
        let view = this.querySelector('events');
        this.events.forEach(event => {
            event.resources.forEach((eventResource)=> {
                let resource = this.resourceMap[eventResource.id];
                let instance = new CalendarEventWeek();
                instance.digest(event, resource);
                view.appendChild(instance);
            });
        });
    }
};
customElements.define('yop-calendar-week', CalendarWeek);

