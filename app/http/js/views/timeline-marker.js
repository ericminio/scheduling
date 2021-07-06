class TimelineMarker extends HTMLElement {
    constructor() {
        super()
    }
    digest(hours) {
        this.id = `hour-${hours}00`;
        this.innerHTML = hours;
        let value = `calc(var(--padding) + var(--minimalWidth) * (${hours} * 60 + 0) / var(--minimalWidthInMinutes))`;
        this.style = `left:${value};`;
    }
};
customElements.define('yop-timeline-marker', TimelineMarker);
