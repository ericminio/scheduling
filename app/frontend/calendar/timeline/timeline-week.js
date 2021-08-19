class TimelineWeek extends HTMLElement {
    constructor() {
        super();
        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    async connectedCallback() {
        await this.displayTimelineMarks();
    }
    async displayTimelineMarks() {
        this.innerHTML = '';
        this.days.forEach((day, index)=> {
            let marker = new TimelineWeekMarker();
            marker.digest(day, index);
            this.appendChild(marker);
        });
    }
}
customElements.define('yop-timeline-week', TimelineWeek);