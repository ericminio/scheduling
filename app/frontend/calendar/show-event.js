const showEventTemplate = document.createElement('template')
showEventTemplate.innerHTML = `

<style>
    #show-event-form {
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
        this.deleteEvent = new DeleteEvent();
        this.deleteEvent.use({ deleteEvent:new EventDeleteUsingHttp(api) });
    }
    connectedCallback() {
        this.appendChild(showEventTemplate.content.cloneNode(true));
        this.querySelector('#delete-event').addEventListener('click', ()=> { this.goDeleteEvent(); });
        this.eventId = eventBus.register(this, 'show event');
    }
    disconnectedCallback(){
        eventBus.unregister(this.eventId);
    }
    update(event) {
        this.event = event;
        this.querySelector('#show-event-form').classList.toggle('hidden');
        this.querySelector('#event-info-label').value = event.getLabel();
        this.querySelector('#event-info-notes').value = event.getNotes();
        this.querySelector('#event-info-start').value = event.getStart();
        this.querySelector('#event-info-end').value = event.getEnd();
    }
    goDeleteEvent() {
        this.deleteEvent.please(this.event)
            .then(()=> { 
                eventBus.notify('event deleted'); 
                this.querySelector('#show-event-form').classList.add('hidden');
            })
            .catch(error => { eventBus.notify('error', { message:error.message }); });
    }
};
customElements.define('show-event', ShowEvent);

