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
                    <div>
                    <button id="calendar-previous-day"><</button>
                        <button id="calendar-next-day">></button>
                        <input id="calendar-date" />
                        <button id="calendar-search">Show</button>
                    </div>
                    <yop-timeline></yop-timeline>
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
        this.querySelector('events').addEventListener('click', (e)=>{
            events.notify('event creation', this.querySelector("#calendar-date").value);
        });
        this.querySelector('#calendar-search').addEventListener('click', (e)=>{
            events.notify('calendar update');
        });
        this.querySelector('#calendar-next-day').addEventListener('click', ()=> {
            let current = this.querySelector("#calendar-date").value;
            let next = formatDate(nextDay(current));
            this.querySelector("#calendar-date").value = next;
            events.notify('calendar update');
        });
        this.querySelector('#calendar-previous-day').addEventListener('click', ()=> {
            let current = this.querySelector("#calendar-date").value;
            let previous = formatDate(previousDay(current));
            this.querySelector("#calendar-date").value = previous;
            events.notify('calendar update');
        });
        events.register(this, 'calendar update');
        events.register(this, 'resource created');
        events.register(this, 'event created');
        events.register(this, 'event deleted');
        events.register(this, 'resource deleted');
        this.querySelector("#calendar-date").value = formatDate(today());
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
                let instance = new CalendarEvent();
                instance.digest(event, resource);
                view.appendChild(instance);
            });
        });
    }
};
customElements.define('yop-calendar', Calendar);

