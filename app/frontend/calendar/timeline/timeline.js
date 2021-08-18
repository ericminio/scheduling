class Timeline extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        await this.displayTimelineMarks();
    }
    async displayTimelineMarks() {
        let configuration = await data.configuration();
        let end = configuration.getOpeningHoursEnd();
        let current = configuration.getOpeningHoursStart();
        let starts = [];
        while (current < end) {
            starts = starts.concat(current);
            current ++;
        }

        this.innerHTML = '';
        starts.forEach((start)=>{
            let marker = new TimelineMarker();
            marker.digest({ hours:start, minutes:0 });
            this.appendChild(marker);
        })
    }
}
customElements.define('yop-timeline', Timeline);