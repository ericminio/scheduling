const resourceCreationTriggerTemplate = document.createElement('template')
resourceCreationTriggerTemplate.innerHTML = `

<style>
    #resource-creation-trigger {
        cursor: pointer;
    }
    .plus {
        color: var(--color-add-ressource);
    }
</style>

<div id="resource-creation-trigger">
    <label class="plus">+</label>
</div>
`;

class ResourceCreationTrigger extends HTMLElement {

    constructor() {
        super()
    }
    async connectedCallback() {
        this.appendChild(resourceCreationTriggerTemplate.content.cloneNode(true))
        this.querySelector('#resource-creation-trigger').addEventListener('click', ()=>{
            eventBus.notify('resource creation trigger')
        })
    }
};
customElements.define('resource-creation-trigger', ResourceCreationTrigger);

