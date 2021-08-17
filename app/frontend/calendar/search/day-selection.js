const daySelectionTemplate = document.createElement('template');
daySelectionTemplate.innerHTML = `
<div>
    <button id="calendar-previous-day"><</button>
    <button id="calendar-next-day">></button>
    <input id="calendar-date" />
    <button id="calendar-search">Show</button>
</div>                
`;

class DaySelection extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        this.appendChild(daySelectionTemplate.content.cloneNode(true))
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
        this.querySelector("#calendar-date").value = formatDate(today());
    }
}

customElements.define('yop-day-selection', DaySelection);