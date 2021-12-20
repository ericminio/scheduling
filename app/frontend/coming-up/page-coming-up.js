const comingUpTemplate = document.createElement('template')
comingUpTemplate.innerHTML = `

<style>
    .coming-up-table {
        width: 100%;    
        border-spacing: 0px;    
    }
    .coming-up-table td {
        padding: 0px;
        vertical-align: top;
    }
    .coming-up-table ol {
        padding: 0px;
        margin-top: var(--vertical-margin);
        margin-bottom: var(--vertical-margin);
        margin-left: 0px;
        margin-right: 0px;
    }
</style>

<yop-menu></yop-menu>

<div style="position: relative;">
    <table class="coming-up-table">
        <tbody>
            <tr>
                <td id="coming-up-events"></td>
            </tr>
        </tbody>
    </table>
</div>
`;

const comingUpEventTemplate = `
<div id="coming-up-event-id">
    event-starthour - event-endhour event-label 
</div>`
const comingUpEventDayTemplateOpen = `<div id="day-id">event-day`;
const comingUpEventDayTemplateClose = `</div>`;

class PageComingUp extends HTMLElement {

    constructor() {
        super();
        this.searchEvents = new SearchEvents();
        this.searchEvents.use({ searchEvents:new EventsSearchUsingHttp(api) });
    }
    async connectedCallback() {
        this.appendChild(comingUpTemplate.content.cloneNode(true))
        this.eventsView = this.querySelector('#coming-up-events')
        this.load(today())               
    }
    load(date) {
        let start = `${formatDate(date)} 00:00:00`;
        let end = `${formatDate(addDays(30, date))} 00:00:00`;
        let eventsLoaded = this.searchEvents.inRange(start, end);
        this.clear();
        eventsLoaded.then(data => {
            this.displayEvents(data.events)
        }); 
    }
    clear() {

    }
    displayEvents(events) {
        events.sort((a, b) => a.start > b.start)        
        let html = ''
        let previousDay;
        events.forEach(event => {
            let day = event.start.split(' ')[0]
            if (day != previousDay) {
                previousDay = day
                if (html.length >0) {
                    html += comingUpEventDayTemplateClose;
                }
                html += comingUpEventDayTemplateOpen
                    .replace('day-id', `day-${day}`)
                    .replace('event-day', day)
            }

            html += comingUpEventTemplate
                .replace('event-id', `event-${event.id}`)
                .replace('event-label', event.label)
                .replace('event-starthour', event.start.split(' ')[1])
                .replace('event-endhour', event.end.split(' ')[1])
        })
        this.eventsView.innerHTML = html
    }

};
customElements.define('page-coming-up', PageComingUp);

