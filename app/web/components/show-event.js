const showEventTemplate = document.createElement('template')
showEventTemplate.innerHTML = `

<style>
    #show-event-form {
        position: absolute;
        right: var(--padding);
        width: calc( 2.5 * var(--resourceAreaWidth));
    }
</style>

<div class="vertical-form hidden" id="show-event-form">
    <label>Label</label>
    <input id="event-info-label" />
    <label>Start</label>
    <input id="event-info-start" />
    <label>End</label>
    <input id="event-info-end" />
<div>
`;

class ShowEvent extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(showEventTemplate.content.cloneNode(true));
        events.register(this, 'show event');
    }
    update(event) {
        this.querySelector('#show-event-form').classList.toggle('hidden');
        this.querySelector('#event-info-label').value = event.label;
        this.querySelector('#event-info-start').value = event.start;
        this.querySelector('#event-info-end').value = event.end;
    }
};
customElements.define('show-event', ShowEvent);

