const successMessageTemplate = document.createElement('template')
successMessageTemplate.innerHTML = `
<style>
    #success-message {
        position: absolute;
        top: 0px;
        right: 0px;
        margin: 5px;
        padding: 10px;
        cursor: pointer;

        color: var(--color-success);
        background-color: var(--background-success);
    }
</style>
<div id="success-message" class="hidden">
</div>
`;

class SuccessMessage extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(successMessageTemplate.content.cloneNode(true));
        this.querySelector('#success-message').addEventListener('click', ()=> { this.acknowledge(); } );
        events.register(this, 'success');
    }
    update(value) {
        console.log('success', value);
        this.querySelector('#success-message').classList.remove('hidden');
        this.querySelector('#success-message').innerHTML = value.message;
    }
    acknowledge() {
        this.querySelector('#success-message').classList.add('hidden');
    }
};
customElements.define('yop-success-message', SuccessMessage);

