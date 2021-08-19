const pageCalendarWeekTemplate = document.createElement('template')
pageCalendarWeekTemplate.innerHTML = `
<yop-menu></yop-menu>

<yop-calendar-week></yop-calendar-week>
`;

class PageCalendarWeek extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(pageCalendarWeekTemplate.content.cloneNode(true));
    }
};
customElements.define('page-calendar-week', PageCalendarWeek);

