class Timeline extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        await this.displayTimelineMarks();
    }
    async displayTimelineMarks() {
        this.innerHTML = '';
        let configuration = await data.configuration();
        let current = configuration.getOpeningHoursStart();
        let end = configuration.getOpeningHoursEnd();
        while (current < end) { 
            let marker = new TimelineMarker();
            marker.digest({ hours:current, minutes:0 });
            this.appendChild(marker);
            current ++;
        }
    }
}
customElements.define('yop-timeline', Timeline);