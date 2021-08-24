const daySelectionTemplate = document.createElement('template');
daySelectionTemplate.innerHTML = `
<style>
    #calendar-date-day-name {
        color: var(--color-day-name);
    }
</style>
<div>
    <button id="calendar-previous-day"><</button>
    <button id="calendar-next-day">></button>
    <input id="calendar-date" />
    <button id="calendar-search">Show</button>
    <label id="calendar-date-day-name"></label>
</div>                
`;

class DaySelection extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        this.appendChild(daySelectionTemplate.content.cloneNode(true))
        this.querySelector('#calendar-search').addEventListener('click', (e)=>{
            this.notifiesWhenValid();
        });
        this.querySelector('#calendar-next-day').addEventListener('click', ()=> {
            let current = this.querySelector("#calendar-date").value;
            let next = formatDate(nextDay(current));
            this.setDate(next);
            this.notifiesWhenValid();
        });
        this.querySelector('#calendar-previous-day').addEventListener('click', ()=> {
            let current = this.querySelector("#calendar-date").value;
            let previous = formatDate(previousDay(current));
            this.setDate(previous);
            this.notifiesWhenValid();
        });
        this.setDate(formatDate(today()));
    }
    setDate(value) {
        let date = dateFrom(value);
        let day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][(date.getDay()+6) % 7];
        this.querySelector("#calendar-date").value = value;
        this.querySelector("#calendar-date-day-name").innerHTML = day;
    }
    notifiesWhenValid() {
        let date = this.querySelector("#calendar-date").value;
        if (isValidDate(date)) {
            events.notify('calendar update', date);
        }
        else {
            events.notify('error', { message:'Invalid date. Expected format is yyyy-mm-dd' });
        }
    }
}

customElements.define('yop-day-selection', DaySelection);