class TimelineWeekMarker extends HTMLElement {
    constructor() {
        super()
    }
    digest(dayname, index) {
        this.id = `day-${dayname.toLowerCase()}`;
        this.innerHTML = `${dayname}`;
        this.style = `
            left:${this.left(index)};
            width:${this.width()};
        `;
    }
    left(index) {
        return layout.weekdayLeft(index);
    }
    width() {
        return layout.weekdayWidth();
    }
};
customElements.define('yop-timeline-week-marker', TimelineWeekMarker);
