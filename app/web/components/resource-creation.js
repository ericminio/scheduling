const resourceCreationTemplate = document.createElement('template')
resourceCreationTemplate.innerHTML = `
<div>
    <label id="resource-creation">Create resource</label>
    <div id="cresource-creation-form">
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
            api.createResource(payload);
        });
    }
};
customElements.define('resource-creation', ResourceCreation);

