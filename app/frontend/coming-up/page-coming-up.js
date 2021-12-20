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
    .column-one {
        width: var(--resourceAreaWidth);
    }
    .column-two, .column-three {
        width: calc(var(--agendaAreaWidth) / 2);
    }
    .column-two-three-together {
        width: var(--agendaAreaWidth);
    }

    .calendar-table .vertical-form {
        margin-top: 0px;
    }
</style>

<yop-menu></yop-menu>

<div style="position: relative;">
    <table class="coming-up-table">
        <tbody>
            <tr>
                <td class="column-one"></td>
                <td class="column-two-three-together" colspan="2">
                    <ol id="day-2015-09-21">
                        <li></li>
                    </ol>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;

class PageComingUp extends HTMLElement {

    constructor() {
        super();
        this.searchEvents = new SearchEvents();
        this.searchEvents.use({ searchEvents:new EventsSearchUsingHttp(api) });
    }
    async connectedCallback() {
        this.appendChild(comingUpTemplate.content.cloneNode(true))
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
        this.querySelector('#day-2015-09-21').innerHTML = `<li>${JSON.stringify(events)}</li>`
    }

};
customElements.define('page-coming-up', PageComingUp);

