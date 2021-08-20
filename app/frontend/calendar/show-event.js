const showEventTemplate = document.createElement('template')
showEventTemplate.innerHTML = `

<style>
    #show-event-form {
        position: absolute;
        right: var(--padding);
        width: calc(var(--agendaAreaWidth) / 2 - 2 * var(--padding) - 2 * var(--body-margin));
    }
    #delete-event {
        background-color: var(--background-delete);
        color: var(--color-delete);
    }
</style>

<div class="vertical-form hidden" id="show-event-form">
    <label>Label</label>
    <input id="event-info-label" />
    <label>Notes</label>
    <textarea id="event-info-notes"></textarea>
    <label>Start</label>
    <input id="event-info-start" />
    <label>End</label>
    <input id="event-info-end" />

    <button id="delete-event">Delete</button>
<div>
`;

class ShowEvent extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(showEventTemplate.content.cloneNode(true));
        this.querySelector('#delete-event').addEventListener('click', ()=> { this.deleteEvent(); });
        events.register(this, 'show event');
    }
    update(event) {
        this.event = event;
        this.querySelector('#show-event-form').classList.toggle('hidden');
        this.querySelector('#event-info-label').value = event.getLabel();
        this.querySelector('#event-info-notes').value = event.getNotes();
        this.querySelector('#event-info-start').value = event.getStart();
        this.querySelector('#event-info-end').value = event.getEnd();
    }
    deleteEvent() {
        api.deleteEvent(this.event).then(()=> { 
            events.notify('event deleted'); 
            this.querySelector('#show-event-form').classList.add('hidden');
        });
    }
};
customElements.define('show-event', ShowEvent);

