const pageCalendarDayTemplate = document.createElement('template')
pageCalendarDayTemplate.innerHTML = `
<yop-menu></yop-menu>

<yop-calendar-day></yop-calendar-day>
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

