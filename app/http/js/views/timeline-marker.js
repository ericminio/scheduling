class TimelineMarker extends HTMLElement {
    constructor() {
        super()
    }
    digest(hours) {
        this.id = `hour-${hours}00`;
        this.innerHTML = `${hours}`;
        this.style = `left:${this.left(hours)};`;
    }
    left(hours) {
        return `calc(var(--padding) + var(--minimalWidth) * (${hours} * 60 + 0) / var(--minimalWidthInMinutes))`
    }
};
customElements.define('yop-timeline-marker', TimelineMarker);
