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
        this.querySelector('#calendar-date').addEventListener('keyup', (e)=>{ 
            this.updateDayName();
            if (e.key == 'Enter') { this.notifiesWhenValid(); }
        });
        this.querySelector('#calendar-search').addEventListener('click', (e)=>{
            this.updateDayName();
            this.notifiesWhenValid();
        });
        this.querySelector('#calendar-next-day').addEventListener('click', ()=> {
            let current = this.querySelector("#calendar-date").value;
            let next = formatDate(nextDay(current));
            this.setDate(next);
            this.updateDayName();
            this.notifiesWhenValid();
        });
        this.querySelector('#calendar-previous-day').addEventListener('click', ()=> {
            let current = this.querySelector("#calendar-date").value;
            let previous = formatDate(previousDay(current));
            this.setDate(previous);
            this.updateDayName();
            this.notifiesWhenValid();
        });
        this.setDate(formatDate(today()));
        this.updateDayName();
        this.notifiesWhenValid();
        this.eventIds = [
            eventBus.register(this.notifiesWhenValid.bind(this), 'calendar update request')
        ];
    }
    async disconnectedCallback() {
        eventBus.unregisterAll(this.eventIds);
    }
    setDate(value) {
        this.querySelector("#calendar-date").value = value;
    }
    updateDayName() {
        let value = this.querySelector("#calendar-date").value;
        if (isValidDate(value)) {
            this.querySelector("#calendar-date-day-name").innerHTML = weekday(value);
        }
        else {
            this.querySelector("#calendar-date-day-name").innerHTML = '';
        }
    }
    notifiesWhenValid() {
        let value = this.querySelector("#calendar-date").value;
        if (isValidDate(value)) {
            eventBus.notify('calendar update', value);
        }
        else {
            eventBus.notify('error', { message:'Invalid date. Expected format is yyyy-mm-dd' });
        }
    }
}

customElements.define('yop-day-selection', DaySelection);