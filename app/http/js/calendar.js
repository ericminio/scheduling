const calendarTemplate = document.createElement('template')
calendarTemplate.innerHTML = `
<timeline>
    <hour id="hour-0000" style="left: calc(0 * 2 * var(--halfHourWidth) + var(--padding));">0</hour>
    <hour id="hour-0800" style="left: calc(8 * 2 * var(--halfHourWidth) + var(--padding));">8</hour>
    <hour id="hour-1000" style="left: calc(10 * 2 * var(--halfHourWidth) + var(--padding));">10</hour>
    <hour id="hour-1200" style="left: calc(12 * 2 * var(--halfHourWidth) + var(--padding));">12</hour>
    <hour id="hour-1400" style="left: calc(14 * 2 * var(--halfHourWidth) + var(--padding));">14</hour>
    <hour id="hour-1600" style="left: calc(16 * 2 * var(--halfHourWidth) + var(--padding));">16</hour>
    <hour id="hour-1800" style="left: calc(18 * 2 * var(--halfHourWidth) + var(--padding));">18</hour>
    <hour id="hour-2000" style="left: calc(20 * 2 * var(--halfHourWidth) + var(--padding));">20</hour>
</timeline>
<events></events>
`;

class CalendarEvent extends HTMLElement {
    constructor() {
        super()
    }
    digest(event) {
        this.id = `event-${event.id}`;
        this.dataset.start = event.start;
        this.dataset.end = event.end;

        let startHour = parseInt(event.start.split(':')[0])
        let endHour = parseInt(event.end.split(':')[0])

        this.style.left = `calc(${startHour} * 2 * var(--halfHourWidth) + var(--padding)`;
        this.style.width = `calc((${endHour} - ${startHour}) * 2 * var(--halfHourWidth))`;
        this.style.top = `calc(${event.line} * var(--height) + var(--padding))`;
    }
}
customElements.define('yop-calendar-event', CalendarEvent)

class Calendar extends HTMLElement {

    constructor() {
        super()
    }
    connectedCallback() {
        this.appendChild(calendarTemplate.content.cloneNode(true))
        this.display([ 
            { id:'E1', start:'00:00', end:'07:00', line:0 },
            { id:'E3', start:'18:00', end:'20:00', line:0 },
            { id:'E5', start:'08:00', end:'11:00', line:1 },
            { id:'E6', start:'21:00', end:'24:00', line:1 } 
    ])
    }
    display(events) {
        let view = this.querySelector('events');
        view.innerHTML = '';
        let maxLine = 0;
        events.forEach(event => {
            let instance = new CalendarEvent();
            instance.digest(event);
            view.appendChild(instance);     
            if (event.line > maxLine) {
                maxLine = event.line
            }           
        });
        let lineCount = maxLine + 1;
        view.style.height = `calc(${lineCount} * var(--height) + 2 * var(--padding))`;
    }
}
customElements.define('yop-calendar', Calendar)

