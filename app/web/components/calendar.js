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
                        <input id="calendar-date" />
                        <button id="calendar-search">Show</button>
                    </div>
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
            events.notify('event creation', this.querySelector("#calendar-date").value);
        });
        this.querySelector('#calendar-search').addEventListener('click', (e)=>{
            this.update();
        });
        events.register(this, 'resource created');
        events.register(this, 'event created');
        events.register(this, 'event deleted');
        events.register(this, 'resource deleted');
        this.setDate(today());
        this.update();   
    }
    setDate(date) {
        let month = 1+date.getMonth();
        if (month < 10) { month = '0'+month; }
        let day = date.getDate();
        if (day < 10) { day = '0'+day; }
        let formatted = `${date.getFullYear()}-${month}-${day}`;
        this.querySelector('#calendar-date').value = formatted;
    }
    update() {
        let date = this.querySelector("#calendar-date").value;
        let resourcesLoaded = data.getResources();
        resourcesLoaded
            .then(data => {
                this.resources = data.resources;
                this.resourceMap = {};
                this.resources.forEach((resource) => {
                    this.resourceMap[resource.getId()] = resource; 
                });
                store.saveObject('resources', data.resources);
                this.clear(this.resources.length);
            })
            .catch(()=> { 
                store.delete('resources'); 
                events.notify('maybe signed-out')
            });
        let eventsLoaded = api.getEvents(date);
        eventsLoaded.then(data => this.events = data.events);

        Promise.all([resourcesLoaded, eventsLoaded]).then(()=> { 
            this.displayResources();
            this.displayEvents(); 
        })
    }
    async displayTimelineMarks() {
        let configuration = await data.configuration();
        let openingHours = configuration.getOpeningHours();
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

