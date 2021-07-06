class TimelineMarker extends HTMLElement {
    constructor() {
        super()
    }
    digest(mark) {
        this.id = `hour-${mark.hours}00`;
        this.innerHTML = `${mark.hours}`;
        this.style = `left:${this.left(mark)};`;
    }
    left(mark) {
        return layout.left(mark);
    }
};
customElements.define('yop-timeline-marker', TimelineMarker);
