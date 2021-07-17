const showResourceTemplate = document.createElement('template')
showResourceTemplate.innerHTML = `

<style>
    #show-resource-form {
        position: absolute;
        width: var(--resourceAreaWidth);
    }
</style>

<div class="vertical-form hidden" id="show-resource-form">
    <label>Type</label>
    <input id="resource-info-type" />
    <label>Name</label>
    <input id="resource-info-name" />
<div>
`;

class ShowResource extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(showResourceTemplate.content.cloneNode(true));
        events.register(this, 'show resource');
    }
    update(resource) {
        this.querySelector('#show-resource-form').classList.toggle('hidden');
        this.querySelector('#resource-info-type').value = resource.type;
        this.querySelector('#resource-info-name').value = resource.name;
    }
};
customElements.define('show-resource', ShowResource);

