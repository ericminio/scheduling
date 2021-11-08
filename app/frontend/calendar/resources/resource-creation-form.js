const resourceCreationFormTemplate = document.createElement('template')
resourceCreationFormTemplate.innerHTML = `

<style>
    #resource-creation-form {
    }
</style>

<div class="vertical-form hidden" id="resource-creation-form">
    <label>Type</label>
    <input id="resource-type" />
    <label>Name</label>
    <input id="resource-name" />

    <button id="create-resource">Create</button>
<div>
`;

class ResourceCreationForm extends HTMLElement {

    constructor() {
        super()
        this.createResource = new CreateResource();
        this.createResource.use ({ storeResource:new ResourceCreateUsingHttp(api) });
    }
    async connectedCallback() {
        this.appendChild(resourceCreationFormTemplate.content.cloneNode(true))
        this.querySelector('#create-resource').addEventListener('click', ()=>{
            this.goCreateResource();
        });
        eventBus.register(this, 'resource creation trigger');
    }
    update() {
        this.querySelector('#resource-creation-form').classList.toggle('hidden');
    }
    goCreateResource() {
        let payload = {
            type: this.querySelector('#resource-type').value,
            name: this.querySelector('#resource-name').value
        };
        this.createResource.please(payload)
            .then(()=> { 
                eventBus.notify('success', { message:'Resource created' }); 
                eventBus.notify('resource created'); 
            })
            .catch((error) => {
                eventBus.notify('error', { message:error.message }); 
            });
    }
};
customElements.define('resource-creation-form', ResourceCreationForm);

