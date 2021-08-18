const pageCalendarDayTemplate = document.createElement('template')
pageCalendarDayTemplate.innerHTML = `
<yop-menu></yop-menu>

<yop-calendar-day></yop-calendar-day>
<resource-creation></resource-creation>
<event-creation></event-creation>
<show-event></show-event>
`;

class PageCalendarDay extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(pageCalendarDayTemplate.content.cloneNode(true));
    }
};
customElements.define('page-calendar-day', PageCalendarDay);

