const calendarTemplate = document.createElement('template')
calendarTemplate.innerHTML = `
<timeline></timeline>
<events></events>
`;

class Calendar extends HTMLElement {

    constructor() {
        super()
    }
    connectedCallback() {
        this.appendChild(calendarTemplate.content.cloneNode(true))
        this.displayTimelineMarks([0, 1, 8, 10, 12, 14, 16, 18, 20, 23]);
        this.displayEvents([ 
            { id:'E0', start:'00:00', end:'07:00', line:0 },
            { id:'E1', start:'00:30', end:'07:00', line:1 },
            { id:'E2', start:'01:00', end:'07:00', line:2 },
            { id:'E3', start:'18:00', end:'20:00', line:0 },
            { id:'E5', start:'08:00', end:'11:00', line:1 },
            { id:'E6', start:'21:00', end:'24:00', line:1 } 
        ]);
    }
    displayTimelineMarks(starts) {
        let view = this.querySelector('timeline');
        view.innerHTML = '';
        starts.forEach((start)=>{
            let marker = new TimelineMarker();
            marker.digest({ hours:start, minutes:0 });
            view.appendChild(marker);
        })
    }
    displayEvents(events) {
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
};
customElements.define('yop-calendar', Calendar);

