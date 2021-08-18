const pageEventsTemplate = document.createElement('template')
pageEventsTemplate.innerHTML = `
<yop-menu></yop-menu>

<yop-calendar-day></yop-calendar-day>
<resource-creation></resource-creation>
<event-creation></event-creation>
<show-event></show-event>
`;

class PageEvents extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(pageEventsTemplate.content.cloneNode(true));
    }
};
customElements.define('page-events', PageEvents);

