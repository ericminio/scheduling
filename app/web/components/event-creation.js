const eventCreationTemplate = document.createElement('template')
eventCreationTemplate.innerHTML = `

<style>
    #event-creation-form {
        position: absolute;
        left: calc(var(--body-margin) + var(--resourceAreaWidth));
        width: calc( 2 * var(--resourceAreaWidth));
    }
    #new-event-resources input, #new-event-resources label {
        display: unset;
        width: unset;
    }
</style>

<div class="vertical-form hidden" id="event-creation-form">
    <label>Label</label>
    <input id="new-event-label" />
    <label>Start</label>
    <input id="new-event-start" />
    <label>End</label>
    <input id="new-event-end" />
    <div id="new-event-resources"></div>

    <button id="create-event">Create</button>
<div>
`;

class EventCreation extends HTMLElement {

    constructor() {
        super()
    }
    connectedCallback() {
        this.appendChild(eventCreationTemplate.content.cloneNode(true));
        this.querySelector('#create-event').addEventListener('click', ()=> { this.createEvent(); });
        events.register(this, 'event creation');
    }
    update() {
        let resources = store.getObject('resources');
        let html = '';
        for (let i=0 ; i<resources.length; i++) {
            let resource = resources[i];
            let fragment = `
            <div style="display:inline-block;">
                <input  type="checkbox"
                        id="new-event-resource-${resource.id}" 
                        value="${resource.id}"
                        >
                <label for="new-event-resource-${resource.id}">${resource.name}</label>
            </div>`;
            html += fragment;
        }
        this.querySelector('#new-event-resources').innerHTML = html;        
        this.querySelector('#event-creation-form').classList.toggle('hidden');
    }
    createEvent() {
        api.createEvent(this.payload())
                .then(()=> { events.notify('event created'); } );;
    }
    payload() {
        let candidates = this.querySelectorAll('#new-event-resources input');
        let selected = [];
        for (let i=0; i<candidates.length; i++) {
            let candidate = candidates[i];
            if (candidate.checked) {
                selected.push({ id:candidate.value });
            }
        }
        return {
            label: this.querySelector('#new-event-label').value,
            start: this.querySelector('#new-event-start').value,
            end: this.querySelector('#new-event-end').value,
            resources: selected
        };
    }
};
customElements.define('event-creation', EventCreation);

