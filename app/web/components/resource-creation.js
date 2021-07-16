const resourceCreationTemplate = document.createElement('template')
resourceCreationTemplate.innerHTML = `

<style>
    .resource-creation-area {
        width: calc( 2.5 * var(--resourceAreaWidth));
    }
    .hidden {
        display: none;
    }
</style>

<div class="resource-creation-area">
    <label id="resource-creation">Create resource</label>
    <div class="vertical-form hidden" id="resource-creation-form">
        <label>Type</label>
        <input id="resource-type" />
        <label>Name</label>
        <input id="resource-name" />

        <button id="create-resource">Create</button>
    <div>
</div>
`;

class ResourceCreation extends HTMLElement {

    constructor() {
        super()
    }
    async connectedCallback() {
        this.appendChild(resourceCreationTemplate.content.cloneNode(true))
        this.querySelector('#create-resource').addEventListener('click', ()=>{
            let payload = {
                type: this.querySelector('#resource-type').value,
                name: this.querySelector('#resource-name').value
            };
            api.createResource(payload)
                .then(()=> { events.notify('resource created'); } );
        });
        this.querySelector('#resource-creation').addEventListener('click', ()=>{
            this.querySelector('#resource-creation-form').classList.toggle('hidden');
        })
    }
};
customElements.define('resource-creation', ResourceCreation);

