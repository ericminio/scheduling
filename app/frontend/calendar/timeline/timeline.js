class Timeline extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        await this.displayTimelineMarks();
    }
    async displayTimelineMarks() {
        let configuration = await data.configuration();
        let openingHours = configuration.getOpeningHours();
        let parts = openingHours.split('-');
        let end = parseInt(parts[1])
        let current = parseInt(parts[0])
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